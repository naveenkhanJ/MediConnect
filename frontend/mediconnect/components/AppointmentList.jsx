"use client";

import { useState, useEffect } from "react";
import { Clock, CalendarDays, MoreVertical } from "lucide-react";
import { filterAppointments } from "@/lib/appointmentListFilters";

const STATUS_DISPLAY = {
  CONFIRMED: "Confirmed",
  PENDING_PAYMENT: "Pending",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  PAYMENT_FAILED: "Payment Failed",
};

function toDisplayStatus(status) {
  return STATUS_DISPLAY[status] ?? status;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user?.id || !token) {
          setError("Please login to view appointments.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:4000/api/appointments/my/list", {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-patient-id": user.id,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load appointments.");
          return;
        }

        // Normalise API response to the shape the UI expects
        const normalised = (Array.isArray(data) ? data : data.appointments ?? []).map((appt) => ({
          id: appt.id,
          name: appt.doctorName || "Doctor",
          department: appt.specialty || "",
          date: appt.appointmentDate
            ? `${appt.appointmentDate}${appt.timeSlot ? " " + appt.timeSlot : ""}`
            : "—",
          status: toDisplayStatus(appt.status),
          consultationType: appt.consultationType,
        }));

        setAppointments(normalised);
      } catch (err) {
        setError("Something went wrong loading appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filters = ["All", "Confirmed", "Pending", "Cancelled", "Completed"].map((name) => ({
    name,
    count: name === "All"
      ? appointments.length
      : appointments.filter((a) => a.status === name).length,
  }));

  const filteredAppointments = filterAppointments(appointments, {
    searchQuery,
    activeFilter,
    selectedDate,
  });

  return (
    <div className="p-6 bg-white mt-20">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery("")} className="text-sm text-gray-600 underline">
            Clear
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-3 h-3 bg-[#5F6FFF] rounded-full"></span>
        <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {filters.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveFilter(item.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm
                ${activeFilter === item.name
                  ? "bg-[#5F6FFF] text-white border-[#5F6FFF]"
                  : "bg-white text-gray-700"}`}
            >
              {item.name}
              <span className={`px-2 py-0.5 rounded-full text-xs
                ${activeFilter === item.name ? "bg-white text-[#5F6FFF]" : "bg-gray-100 text-gray-600"}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          {selectedDate && (
            <button type="button" onClick={() => setSelectedDate("")} className="text-sm text-gray-600 underline">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading / Error / Empty states */}
      {loading && <p className="text-sm text-gray-500 py-8 text-center">Loading appointments...</p>}
      {!loading && error && <p className="text-sm text-red-500 py-8 text-center">{error}</p>}
      {!loading && !error && filteredAppointments.length === 0 && (
        <p className="text-sm text-gray-400 py-8 text-center">No appointments found.</p>
      )}

      {/* Appointment Cards */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredAppointments.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center flex-wrap gap-4"
            >
              {/* Col 1 — Doctor */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-[#5F6FFF]/10 flex items-center justify-center text-[#5F6FFF] font-bold text-lg">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#5F6FFF] text-sm font-semibold">#{item.id.slice(0, 8)}</p>
                  <h2 className="font-semibold text-gray-800">{item.name}</h2>
                </div>
              </div>

              {/* Col 2 — Date & Specialty */}
              <div className="min-w-[220px]">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock size={14} />
                  {item.date}
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.department}</p>
                {item.consultationType && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.consultationType}</p>
                )}
              </div>

              {/* Col 3 — Status & Actions */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs rounded-full font-medium
                  ${item.status === "Confirmed" || item.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : item.status === "Pending" || item.status === "Rescheduled"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"}`}>
                  {item.status}
                </span>

                <button className="p-2 rounded-full hover:bg-gray-100">
                  <CalendarDays size={18} />
                </button>

                <button
                  onClick={() => { setSelectedAppointment(item); setShowCancelPopup(true); }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Cancel Appointment</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel #{selectedAppointment?.id.slice(0, 8)}?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancelPopup(false)} className="px-4 py-2 border rounded-md">
                No
              </button>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const res = await fetch(
                      `http://localhost:4000/appointments/${selectedAppointment.id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: "CANCELLED" }),
                      }
                    );
                    const data = await res.json();
                    if (!res.ok) { alert(data.message || "Cancel failed"); return; }
                    setAppointments((prev) =>
                      prev.map((a) =>
                        a.id === selectedAppointment.id ? { ...a, status: "Cancelled" } : a
                      )
                    );
                    setShowCancelPopup(false);
                  } catch {
                    alert("Something went wrong");
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
