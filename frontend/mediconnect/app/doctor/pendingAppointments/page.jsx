"use client";

import { useEffect, useState } from "react";

export default function PendingAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/appointments/doctor/bb910126-bc62-4d81-8c8f-641325b178e1/pending", {
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
          <p>Patient: {a.patientId}</p>
          <p>Time: {a.timeSlot}</p>
        </div>
      ))}
    </div>
  );
}