"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const DOCTOR_ID = "d5aeffa5-4623-4d93-9fc3-3b971e72751d";

export default function PendingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // 🔹 Fetch pending appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/appointments/doctor/${DOCTOR_ID}/pending`,
        {
          headers: { Authorization: "mock-token" },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) setAppointments(data);
      else if (data?.appointments) setAppointments(data.appointments);
      else setAppointments([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Accept Appointment
  const handleAccept = async (id) => {
    try {
      setLoadingId(id);

      const res = await fetch(
        `http://localhost:4000/api/appointments/${id}/decision`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: DOCTOR_ID,
            status: "ACCEPTED",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to accept");
      }

      // ✅ Refresh from DB (BEST PRACTICE)
      fetchAppointments();

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  // ❌ Reject Appointment
  const handleReject = async (id) => {
    try {
      setLoadingId(id);

      const res = await fetch(
        `http://localhost:4000/api/appointments/${id}/decision`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: DOCTOR_ID,
            status: "REJECTED",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reject");
      }

      // ✅ Refresh list
      fetchAppointments();

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">
        Pending Appointments
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl overflow-hidden">

          {/* HEADER */}
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <tr>
              <th className="p-3 text-left">Patient ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No pending appointments
                </td>
              </tr>
            ) : (
              appointments.map((a, index) => (
                <tr
                  key={a.id}
                  className={`border-t hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-700">
                    {a.patientId}
                  </td>

                  <td className="p-3 text-gray-600">
                    {a.appointmentDate}
                  </td>

                  <td className="p-3 text-gray-600">
                    {a.timeSlot}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      disabled={loadingId === a.id}
                      onClick={() => handleAccept(a.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow disabled:opacity-50"
                    >
                      {loadingId === a.id ? "Processing..." : "Accept"}
                    </button>

                    <button
                      disabled={loadingId === a.id}
                      onClick={() => handleReject(a.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}