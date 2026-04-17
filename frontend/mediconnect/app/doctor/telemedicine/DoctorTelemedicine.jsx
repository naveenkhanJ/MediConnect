"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { apiFetch } from "@/lib/api";

const API = "http://localhost:4000";

const SESSION_COLORS = {
  SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
  ACTIVE:    "bg-green-100 text-green-700 border-green-200",
  COMPLETED: "bg-gray-100 text-gray-500 border-gray-200",
  CANCELLED: "bg-red-100 text-red-500 border-red-200",
};

export default function DoctorTelemedicine() {
  const { user } = useContext(AppContext);
  const router = useRouter();

  // Confirmed ONLINE appointments that the doctor can start sessions for
  const [appointments, setAppointments] = useState([]);
  // Sessions already created: appointmentId → session object
  const [sessions, setSessions] = useState({});
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [actionId, setActionId] = useState(null); // appointmentId being acted on

  const doctorId = user?.id;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoadingAppts(true);
    try {
      const data = await apiFetch("/api/doctor/appointments/pending", { auth: true });
      const online = (Array.isArray(data) ? data : data.appointments || []).filter(
        (a) => a.consultationType === "ONLINE"
      );
      setAppointments(online);
      await fetchSessionsForAppointments(online);
    } catch {
      // non-critical
    } finally {
      setLoadingAppts(false);
    }
  };

  const fetchSessionsForAppointments = async (appts) => {
    const results = await Promise.all(
      appts.map(async (a) => {
        try {
          const res = await fetch(
            `${API}/api/telemedicine/appointment/${a.id}`,
            {
              headers: {
                ...(doctorId ? { "x-user-id": doctorId } : {}),
                "x-user-role": "DOCTOR",
              },
            }
          );
          if (!res.ok) return null;
          const data = await res.json();
          return { appointmentId: a.id, session: data?.data ?? data };
        } catch {
          return null;
        }
      })
    );
    const map = {};
    for (const r of results) {
      if (r) map[r.appointmentId] = r.session;
    }
    setSessions(map);
  };

  const handleCreateSession = async (appt) => {
    setActionId(appt.id);
    try {
      const res = await fetch(`${API}/api/telemedicine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(doctorId ? { "x-user-id": doctorId } : {}),
          "x-user-role": "DOCTOR",
        },
        body: JSON.stringify({ appointmentId: appt.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not create session.");
        return;
      }
      const session = data?.data ?? data;
      setSessions((prev) => ({ ...prev, [appt.id]: session }));
    } catch {
      alert("Something went wrong.");
    } finally {
      setActionId(null);
    }
  };

  const handleJoin = (session) => {
    router.push(`/video-call/${session.id}`);
  };

  const handleEndSession = async (session, appointmentId) => {
    if (!confirm("End this consultation? The patient will be notified.")) return;
    setActionId(appointmentId);
    try {
      const res = await fetch(`${API}/api/telemedicine/${session.id}/end`, {
        method: "PATCH",
        headers: {
          ...(doctorId ? { "x-user-id": doctorId } : {}),
          "x-user-role": "DOCTOR",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not end session.");
        return;
      }
      setSessions((prev) => ({
        ...prev,
        [appointmentId]: data?.data ?? data,
      }));
    } catch {
      alert("Something went wrong.");
    } finally {
      setActionId(null);
    }
  };

  if (loadingAppts) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-8 h-8 animate-spin text-[#5F6FFF]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Telemedicine Sessions</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage video consultations for confirmed online appointments</p>
        </div>
        <button
          onClick={fetchAppointments}
          className="text-xs text-[#5F6FFF] hover:underline"
        >
          Refresh
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          <p className="text-sm">No confirmed online appointments found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((appt) => {
            const session = sessions[appt.id];
            const busy = actionId === appt.id;

            return (
              <div key={appt.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                {/* Appointment info */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900">Patient #{appt.patientId}</p>
                    <p className="text-sm text-gray-500">{appt.specialty}</p>
                    <div className="flex gap-3 text-sm text-gray-600 mt-1 flex-wrap">
                      <span>{appt.appointmentDate}</span>
                      <span>·</span>
                      <span>{appt.timeSlot}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                        💻 Online
                      </span>
                    </div>
                  </div>

                  {/* Session status + actions */}
                  <div className="flex flex-col items-end gap-2">
                    {session ? (
                      <>
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${SESSION_COLORS[session.status] || "bg-gray-100 text-gray-500"}`}>
                          {session.status}
                        </span>

                        {/* Meeting link (copy) */}
                        {session.meetingLink && session.status !== "COMPLETED" && session.status !== "CANCELLED" && (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#5F6FFF] hover:underline truncate max-w-[180px]"
                          >
                            {session.meetingLink}
                          </a>
                        )}

                        <div className="flex gap-2">
                          {(session.status === "SCHEDULED" || session.status === "ACTIVE") && (
                            <button
                              onClick={() => handleJoin(session)}
                              disabled={busy}
                              className="px-4 py-1.5 bg-[#5F6FFF] text-white rounded-full text-xs font-medium hover:bg-[#4a5ce6] transition disabled:opacity-50 flex items-center gap-1.5"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
                              </svg>
                              Join
                            </button>
                          )}
                          {session.status === "ACTIVE" && (
                            <button
                              onClick={() => handleEndSession(session, appt.id)}
                              disabled={busy}
                              className="px-4 py-1.5 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 transition disabled:opacity-50"
                            >
                              {busy ? "Ending..." : "End"}
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleCreateSession(appt)}
                        disabled={busy}
                        className="px-4 py-1.5 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {busy ? "Creating..." : "Create Session"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
