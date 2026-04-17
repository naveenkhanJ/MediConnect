"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function PendingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/doctor/appointments/pending", { auth: true });
      if (Array.isArray(data)) setAppointments(data);
      else setAppointments([]);
    } catch (err) {
      if (err.status !== 403) console.error("Failed to load appointments:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/api/doctor/appointments/${id}/decision`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status }),
      });

      // Optimistically remove from list
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      alert(`Appointment ${status.toLowerCase()} successfully`);
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Pending Appointments</h2>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {appointments.length} Pending
        </span>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500">No pending appointments to display</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Patient ID</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time Slot</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-700">{a.patientId}</td>
                  <td className="px-4 py-4 text-gray-600">{a.appointmentDate}</td>
                  <td className="px-4 py-4 text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                      {a.timeSlot}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateStatus(a.id, "ACCEPTED")}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 px-3 rounded-lg text-xs font-semibold transition-all shadow-sm shadow-emerald-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(a.id, "REJECTED")}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-1.5 px-3 rounded-lg text-xs font-semibold transition-all shadow-sm shadow-rose-200"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
