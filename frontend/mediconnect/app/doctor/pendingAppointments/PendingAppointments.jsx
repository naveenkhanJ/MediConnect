"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function PendingAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    apiFetch("/api/doctor/appointments/pending", { auth: true })
      .then(setAppointments)
      .catch((err) => alert(err?.message || "Failed to load appointments"));
  }, []);

  const updateStatus = async (id, status) => {
    await apiFetch(`/api/doctor/appointments/${id}/decision`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ status }),
    });

    setAppointments((prev) =>
      prev.filter((a) => a.id !== id)
    );
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pending Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No pending appointments</p>
      ) : (
        appointments.map((a) => (
          <div key={a.id} className="border p-3 mb-2 rounded">
            <p>Patient: {a.patientId}</p>
            <p>Time: {a.timeSlot}</p>
            <p>Date: {a.appointmentDate}</p>
          </div>
        ))
      )}
    </div>
  );
}
