"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const [paymentData, setPaymentData] = useState(null);   // PayHere form fields
  const [appointment, setAppointment] = useState(null);   // Appointment details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    // Read appointment from localStorage (saved in AppointmentView after booking)
    const storedAppointment = localStorage.getItem("pendingAppointment");
    if (storedAppointment) {
      setAppointment(JSON.parse(storedAppointment));
    }

    // Read payment from localStorage (saved in AppointmentView after booking)
    const storedPayment = localStorage.getItem("pendingPayment");
    if (!storedPayment) {
      setError("No payment record found. Please book an appointment first.");
      setLoading(false);
      return;
    }

    const payment = JSON.parse(storedPayment);

    // Call the payment service (via gateway) to get PayHere form fields + hash
    // The hash must be generated server-side to keep merchant secret safe
    fetch(`http://localhost:4000/api/payments/payhere-params/${payment.id}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Failed to load payment details.");
          });
        }
        return res.json();
      })
      .then((data) => {
        if (!data.amount || !data.hash) {
          throw new Error("Invalid payment data received from server.");
        }
        setPaymentData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load payment details.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#EEF0FF] to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Complete Payment
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          You will be redirected to PayHere to complete your payment securely.
        </p>

        {/* Appointment Summary */}
        {appointment && (
          <div className="bg-[#f5f6ff] rounded-lg p-4 mb-6 text-sm text-gray-700">
            <p><span className="font-semibold">Doctor:</span> {appointment.doctorName}</p>
            <p><span className="font-semibold">Specialty:</span> {appointment.specialty}</p>
            <p><span className="font-semibold">Date:</span> {appointment.appointmentDate}</p>
            <p><span className="font-semibold">Time:</span> {appointment.timeSlot}</p>
            <p><span className="font-semibold">Type:</span> {appointment.consultationType}</p>
          </div>
        )}

        {/* Payment Amount */}
        <div className="flex justify-between items-center border-t border-b py-4 mb-6">
          <span className="text-gray-600 font-medium">Consultation Fee</span>
          <span className="text-xl font-bold text-[#5F6FFF]">
            {paymentData.currency} {paymentData.amount}
          </span>
        </div>

        {/*
          PayHere Checkout Form
          - action points to PayHere sandbox URL
          - All fields are hidden — the user just clicks "Pay Now"
          - PayHere reads these fields, processes payment, then calls notify_url
        */}
        <form
          ref={formRef}
          method="POST"
          action="https://sandbox.payhere.lk/pay/checkout"
        >
          <input type="hidden" name="merchant_id"  value={paymentData.merchant_id} />
          <input type="hidden" name="return_url"   value={paymentData.return_url} />
          <input type="hidden" name="cancel_url"   value={paymentData.cancel_url} />
          <input type="hidden" name="notify_url"   value={paymentData.notify_url} />
          <input type="hidden" name="order_id"     value={paymentData.order_id} />
          <input type="hidden" name="items"        value={paymentData.items} />
          <input type="hidden" name="amount"       value={paymentData.amount} />
          <input type="hidden" name="currency"     value={paymentData.currency} />
          <input type="hidden" name="hash"         value={paymentData.hash} />
          <input type="hidden" name="first_name"   value={paymentData.first_name} />
          <input type="hidden" name="last_name"    value={paymentData.last_name} />
          <input type="hidden" name="email"        value={paymentData.email} />
          <input type="hidden" name="phone"        value={paymentData.phone} />
          <input type="hidden" name="address"      value={paymentData.address} />
          <input type="hidden" name="city"         value={paymentData.city} />
          <input type="hidden" name="country"      value={paymentData.country} />

          <button
            type="submit"
            className="w-full bg-[#5F6FFF] text-white py-3 rounded-lg font-medium hover:opacity-90 transition text-lg"
          >
            Pay Now
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secured by PayHere · Your payment info is never stored on our servers
        </p>
      </div>
    </div>
  );
}
