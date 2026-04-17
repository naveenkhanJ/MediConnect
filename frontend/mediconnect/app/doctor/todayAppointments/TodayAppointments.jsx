"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    apiFetch("/api/doctor/appointments/today", { auth: true })
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
        else if (data?.appointments) setAppointments(data.appointments);
        else setAppointments([]);
      })
      .catch((err) => {
        if (err.status === 403) setAppointments([]);
        else console.error("Today appointments error:", err.message);
      });
  }, []);

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Today Appointments</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Appointment ID</th>
              <th className="p-3 text-left">Patient ID</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No appointments for today
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.id}</td>
                  <td className="p-3">{a.patientId}</td>
                  <td className="p-3">{a.timeSlot}</td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        router.push(`/doctor/prescription/create?appointmentId=${a.id}&patientId=${a.patientId}`)
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Add Prescription
                    </button>

                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      View Report
                    </button>

                    <button className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-purple-600">
                      Start Consultation
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