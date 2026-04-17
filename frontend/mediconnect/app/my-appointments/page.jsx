"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_CONFIG = {
  PENDING_PAYMENT: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  CONFIRMED:       { label: "Confirmed",        color: "bg-green-100 text-green-700 border-green-200" },
  RESCHEDULED:     { label: "Rescheduled",      color: "bg-blue-100 text-blue-700 border-blue-200" },
  CANCELLED:       { label: "Cancelled",        color: "bg-red-100 text-red-600 border-red-200" },
  COMPLETED:       { label: "Completed",        color: "bg-gray-100 text-gray-600 border-gray-200" },
  PAYMENT_FAILED:  { label: "Payment Failed",   color: "bg-red-100 text-red-600 border-red-200" },
};

const CONSULTATION_ICONS = { ONLINE: "💻", PHYSICAL: "🏥" };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function MyAppointmentsPage() {
  const { user, ready } = useContext(AppContext);
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [joiningId, setJoiningId] = useState(null);
  // Map of appointmentId → live status (for real-time polling)
  const [liveStatus, setLiveStatus] = useState({});

  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:4000/api/appointments/my/list", {
        headers: { "x-patient-id": user.id },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to load appointments");
        return;
      }
      setAppointments(Array.isArray(data) ? data : data.appointments || []);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push("/Auth/login");
      return;
    }
    fetchAppointments();
  }, [ready, user, fetchAppointments, router]);

  // Poll live status for any PENDING_PAYMENT or CONFIRMED appointments
  useEffect(() => {
    const active = appointments.filter((a) =>
      ["PENDING_PAYMENT", "CONFIRMED", "RESCHEDULED"].includes(a.status)
    );
    if (active.length === 0) return;

    const interval = setInterval(async () => {
      const updates = await Promise.all(
        active.map(async (appt) => {
          try {
            const res = await fetch(`http://localhost:4000/api/appointments/${appt.id}/status`);
            const data = await res.json();
            return { id: appt.id, status: data.status };
          } catch {
            return null;
          }
        })
      );
      setLiveStatus((prev) => {
        const next = { ...prev };
        for (const update of updates) {
          if (update) next[update.id] = update.status;
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [appointments]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(id);
    try {
      const res = await fetch(`http://localhost:4000/api/appointments/${id}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Cancellation failed");
        return;
      }
      // Refresh list
      await fetchAppointments();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayNow = async (appt) => {
    setPayingId(appt.id);
    try {
      const res = await fetch(`http://localhost:4000/api/payments/appointment/${appt.id}`);
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not retrieve payment details.");
        return;
      }
      const payment = data.payment || data;
      localStorage.setItem("pendingPayment", JSON.stringify(payment));
      localStorage.setItem("pendingAppointment", JSON.stringify(appt));
      router.push(`/payment/${appt.id}`);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  // Fetch or create a telemedicine session for the appointment, then navigate to the video call page
  const handleJoinVideoCall = async (appt) => {
    setJoiningId(appt.id);
    try {
      // Try to fetch an existing session first
      let sessionId = null;
      const getRes = await fetch(
        `http://localhost:4000/api/telemedicine/appointment/${appt.id}`,
        {
          headers: {
            "x-user-id": user?.id || "1",
            "x-user-role": "PATIENT",
          },
        }
      );

      if (getRes.ok) {
        const getData = await getRes.json();
        sessionId = getData?.data?.id ?? getData?.id ?? null;
      }

      // If no session yet, create one
      if (!sessionId) {
        const createRes = await fetch("http://localhost:4000/api/telemedicine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user?.id || "1",
            "x-user-role": "PATIENT",
          },
          body: JSON.stringify({ appointmentId: appt.id }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          alert(createData.message || "Could not create video session.");
          return;
        }
        sessionId = createData?.data?.id ?? createData?.id ?? null;
      }

      if (!sessionId) {
        alert("Could not retrieve video session.");
        return;
      }

      router.push(`/video-call/${sessionId}`);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setJoiningId(null);
    }
  };

  const getDisplayStatus = (appt) => liveStatus[appt.id] || appt.status;

  const canCancel = (status) => ["PENDING_PAYMENT", "CONFIRMED", "RESCHEDULED"].includes(status);
  const canReschedule = (status) => ["CONFIRMED", "RESCHEDULED"].includes(status);
  const canJoinVideo = (appt, status) => status === "CONFIRMED" && appt.consultationType === "ONLINE";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 text-[#5F6FFF] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-gray-500 text-sm">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchAppointments} className="px-6 py-2 bg-[#5F6FFF] text-white rounded-full text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-500 text-sm mt-1">
              {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/book-appointment"
            className="px-5 py-2 bg-[#5F6FFF] text-white rounded-full text-sm font-medium hover:bg-[#4a5ce6] transition"
          >
            + Book New
          </Link>
        </div>

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-[#EEF0FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#5F6FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">No appointments yet</h3>
            <p className="text-gray-400 text-sm mb-6">Book your first appointment with a doctor.</p>
            <Link
              href="/book-appointment"
              className="px-6 py-2 bg-[#5F6FFF] text-white rounded-full text-sm font-medium hover:bg-[#4a5ce6] transition"
            >
              Book Appointment
            </Link>
          </div>
        )}

        {/* Appointment Cards */}
        <div className="flex flex-col gap-4">
          {appointments.map((appt) => {
            const displayStatus = getDisplayStatus(appt);
            const statusChanged = liveStatus[appt.id] && liveStatus[appt.id] !== appt.status;

            return (
              <div
                key={appt.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left — appointment info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900">{appt.doctorName}</h3>
                      <StatusBadge status={displayStatus} />
                      {statusChanged && (
                        <span className="text-xs text-green-600 font-medium animate-pulse">● Updated</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{appt.specialty}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {appt.appointmentDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {appt.timeSlot}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{CONSULTATION_ICONS[appt.consultationType] || "📋"}</span>
                        <span>{appt.consultationType === "ONLINE" ? "Online" : "In-Person"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right — actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {displayStatus === "PENDING_PAYMENT" && (
                      <button
                        onClick={() => handlePayNow(appt)}
                        disabled={payingId === appt.id}
                        className="px-4 py-1.5 bg-yellow-500 text-white rounded-full text-xs font-medium hover:bg-yellow-600 transition disabled:opacity-50"
                      >
                        {payingId === appt.id ? "Loading..." : "Pay Now"}
                      </button>
                    )}
                    {canJoinVideo(appt, displayStatus) && (
                      <button
                        onClick={() => handleJoinVideoCall(appt)}
                        disabled={joiningId === appt.id}
                        className="px-4 py-1.5 bg-[#5F6FFF] text-white rounded-full text-xs font-medium hover:bg-[#4a5ce6] transition disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                        {joiningId === appt.id ? "Joining..." : "Join Video Call"}
                      </button>
                    )}
                    {canReschedule(displayStatus) && (
                      <Link
                        href={`/reschedule/${appt.id}`}
                        className="px-4 py-1.5 border border-[#5F6FFF] text-[#5F6FFF] rounded-full text-xs font-medium hover:bg-[#f0f1ff] transition text-center"
                      >
                        Reschedule
                      </Link>
                    )}
                    {canCancel(displayStatus) && (
                      <button
                        onClick={() => handleCancel(appt.id)}
                        disabled={cancellingId === appt.id}
                        className="px-4 py-1.5 border border-red-300 text-red-500 rounded-full text-xs font-medium hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {cancellingId === appt.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live status note */}
        {appointments.some((a) => ["PENDING_PAYMENT", "CONFIRMED", "RESCHEDULED"].includes(a.status)) && (
          <p className="text-center text-xs text-gray-400 mt-6">
            Status updates automatically every 5 seconds
          </p>
        )}
      </div>
    </div>
  );
}
