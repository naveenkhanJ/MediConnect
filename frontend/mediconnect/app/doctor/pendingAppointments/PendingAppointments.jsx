"use client";

import { useEffect, useState } from "react";

export default function PendingAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/doctor/appointments/pending")
      .then((res) => res.json())
      .then(setAppointments);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:4000/api/doctor/appointments/${id}/decision`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setAppointments((prev) =>
      prev.filter((a) => a.id !== id)
    );
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pending Appointments</h2>

      {appointments.map((a) => (
        <div key={a.id} className="border p-3 mb-2 rounded">
          <p><b>Patient:</b> {a.patientId}</p>
          <p><b>Date:</b> {a.appointmentDate}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => updateStatus(a.id, "CONFIRMED")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus(a.id, "REJECTED")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}