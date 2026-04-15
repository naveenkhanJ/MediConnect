"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState("verifying"); // "verifying" | "confirmed" | "timeout"

  useEffect(() => {
    const stored = localStorage.getItem("pendingAppointment");
    if (!stored) {
      setStatus("confirmed");
      return;
    }

    const appt = JSON.parse(stored);
    setAppointment(appt);

    // Poll the appointment status endpoint up to 8 times (8 seconds)
    // PayHere's notify_url is called server-to-server while the browser is redirected,
    // so there can be a short delay before the DB is updated.
    let attempts = 0;
    const maxAttempts = 8;

    const poll = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/appointments/${appt.id}/status`);
        const data = await res.json();

        if (data.status === "CONFIRMED") {
          setStatus("confirmed");
          localStorage.removeItem("pendingPayment");
          localStorage.removeItem("pendingAppointment");
          return;
        }
      } catch {
        // ignore fetch errors during polling
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 1000);
      } else {
        // Notify was likely delayed — still show success but with a note
        setStatus("timeout");
        localStorage.removeItem("pendingPayment");
        localStorage.removeItem("pendingAppointment");
      }
    };

    poll();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#EEF0FF] to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8 text-center">

        {status === "verifying" ? (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirming Payment...</h2>
            <p className="text-gray-500 text-sm">Please wait while we confirm your appointment.</p>
          </>
        ) : (
          <>
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 text-sm mb-6">
              {status === "confirmed"
                ? "Your appointment has been confirmed."
                : "Your payment was received. Your appointment will be confirmed shortly."}
            </p>

            {/* Appointment Details */}
            {appointment && (
              <div className="bg-[#f5f6ff] rounded-lg p-4 mb-6 text-sm text-gray-700 text-left">
                <p className="font-semibold text-[#5F6FFF] mb-2">Appointment Details</p>
                <p><span className="font-medium">Doctor:</span> {appointment.doctorName}</p>
                <p><span className="font-medium">Specialty:</span> {appointment.specialty}</p>
                <p><span className="font-medium">Date:</span> {appointment.appointmentDate}</p>
                <p><span className="font-medium">Time:</span> {appointment.timeSlot}</p>
                <p><span className="font-medium">Type:</span> {appointment.consultationType}</p>
              </div>
            )}

            <Link
              href="/my-appointments"
              className="block w-full bg-[#5F6FFF] text-white py-3 rounded-lg font-medium hover:opacity-90 transition mb-3"
            >
              View My Appointments
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-200 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Go to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
