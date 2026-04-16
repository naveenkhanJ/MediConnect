"use client";

import { useEffect, useState } from "react";

export default function PendingAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/appointments/doctor/bb910126-bc62-4d81-8c8f-641325b178e1/pending", {
      headers: { Authorization: "mock-token" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
        else if (data?.appointments) setAppointments(data.appointments);
        else setAppointments([]);
      })
      .catch((err) => console.error(err));
  }, []);

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
