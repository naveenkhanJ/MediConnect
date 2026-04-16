"use client";

import { useEffect, useState } from "react";

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/appointments/doctor/doc124/today", {
      headers: { Authorization: "mock-token" },
    })
      .then((res) => res.json())
      .then(setAppointments);
  }, []);

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Today Appointments</h2>

      {appointments.map((a) => (
        <div key={a.id} className="border p-3 mb-2 rounded">
          <p><b>Patient:</b> {a.patientId}</p>
          <p><b>Time:</b> {a.timeSlot}</p>
          <p><b>Type:</b> {a.consultationType}</p>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              a.docStatus === "ACCEPTED"
                ? "bg-green-100 text-green-700"
                : a.docStatus === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {a.docStatus}
          </span>
        </div>
      ))}
    </div>
  );
}