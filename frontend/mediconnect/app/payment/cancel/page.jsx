"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#EEF0FF] to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8 text-center">

        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your payment was cancelled. Your appointment has not been confirmed.
          You can try again or go back to find a doctor.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="block w-full bg-[#5F6FFF] text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Find a Doctor
          </Link>
          <Link
            href="/"
            className="block w-full border border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
