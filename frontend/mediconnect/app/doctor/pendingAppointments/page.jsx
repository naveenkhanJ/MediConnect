"use client";

import { useEffect, useState } from "react";

export default function PendingAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/appointments/doctor/d5aeffa5-4623-4d93-9fc3-3b971e72751d/pending", {
      headers: { Authorization: "mock-token" },
    })
      .then((res) => res.json())
      .then((data) => {
        // ensure array
        if (Array.isArray(data)) {
          setAppointments(data);
        } else if (data?.appointments) {
          setAppointments(data.appointments);
        } else {
          setAppointments([]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ Accept Appointment
  const handleAccept = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/appointments/${id}/accept`, {
        method: "PUT",
      });

      alert("Appointment Accepted");

      // remove from UI
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to accept");
    }
  };

  // ❌ Reject Appointment
  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/appointments/${id}/reject`, {
        method: "PUT",
      });

      alert("Appointment Rejected");

      // remove from UI
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pending Appointments</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No pending appointments
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.patientId}</td>
                  <td className="p-3">{a.appointmentDate}</td>
                  <td className="p-3">{a.timeSlot}</td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleAccept(a.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(a.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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