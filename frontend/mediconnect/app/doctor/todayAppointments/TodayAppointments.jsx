"use client";

import { useEffect, useState } from "react";

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5003/api/appointments/doctor/doc124")
      .then((res) => res.json())
      .then((data) => {
        const today = new Date().toISOString().split("T")[0];

        const filtered = data.filter((a) =>
          a.appointmentDate?.startsWith(today)
        );

        setAppointments(filtered);
      });
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