"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // Read appointment details saved during booking
    const stored = localStorage.getItem("pendingAppointment");
    if (stored) {
      setAppointment(JSON.parse(stored));
    }

    // Clear pending payment data from localStorage
    localStorage.removeItem("pendingPayment");
    localStorage.removeItem("pendingAppointment");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#EEF0FF] to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8 text-center">

        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your appointment has been confirmed. A confirmation will be sent to your email.
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
          href="/"
          className="block w-full bg-[#5F6FFF] text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
