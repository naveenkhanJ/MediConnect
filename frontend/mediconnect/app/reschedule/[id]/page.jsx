"use client";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";

function generateSlots() {
  const today = new Date();
  const days = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);

    const startHour = i === 0 ? Math.max(today.getHours() + 1, 10) : 10;
    const slots = [];
    const cursor = new Date(day);
    cursor.setHours(startHour, 0, 0, 0);
    const end = new Date(day);
    end.setHours(21, 0, 0, 0);

    while (cursor < end) {
      slots.push({
        datetime: new Date(cursor),
        time: cursor.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        value: `${String(cursor.getHours()).padStart(2, "0")}:${String(cursor.getMinutes()).padStart(2, "0")}`,
      });
      cursor.setMinutes(cursor.getMinutes() + 30);
    }

    days.push({ date: new Date(day), slots });
  }
  return days;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ReschedulePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useContext(AppContext);

  const [appointment, setAppointment] = useState(null);
  const [loadingAppt, setLoadingAppt] = useState(true);

  const [slots] = useState(() => generateSlots());
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing appointment details
  useEffect(() => {
    if (!user) {
      router.push("/Auth/login");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/appointments/${id}/status`);
        const data = await res.json();
        setAppointment(data);
      } catch {
        setError("Could not load appointment details.");
      } finally {
        setLoadingAppt(false);
      }
    })();
  }, [id, user, router]);

  const handleReschedule = async () => {
    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }

    const dayObj = slots[selectedDate];
    const d = dayObj.date;
    const appointmentDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:4000/api/appointments/${id}/reschedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentDate, timeSlot: selectedTime }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Reschedule failed. The slot may already be taken.");
        return;
      }
      router.push("/my-appointments");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAppt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <svg className="w-10 h-10 text-[#5F6FFF] animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push("/my-appointments")}
          className="text-sm text-[#5F6FFF] hover:underline mb-6 flex items-center gap-1"
        >
          ← Back to My Appointments
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reschedule Appointment</h1>
        {appointment && (
          <p className="text-gray-500 text-sm mb-6">
            Currently booked: <span className="font-medium text-gray-700">{appointment.appointmentDate} at {appointment.timeSlot}</span>
          </p>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="font-semibold text-gray-800 mb-4">Select a New Date</p>

          {/* Date Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
            {slots.map((day, i) => (
              <button
                key={i}
                onClick={() => { setSelectedDate(i); setSelectedTime(""); }}
                className={`min-w-[60px] text-center flex-shrink-0 py-4 px-3 rounded-full text-sm font-medium transition-colors ${
                  selectedDate === i
                    ? "bg-[#5F6FFF] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <p>{DAYS[day.date.getDay()]}</p>
                <p className="text-xs mt-1">{day.date.getDate()}</p>
              </button>
            ))}
          </div>

          <p className="font-semibold text-gray-800 mb-3">Select a Time Slot</p>

          {/* Time Slot Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {slots[selectedDate]?.slots.map((slot, i) => (
              <button
                key={i}
                onClick={() => setSelectedTime(slot.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedTime === slot.value
                    ? "bg-[#5F6FFF] text-white border-[#5F6FFF]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#5F6FFF] hover:text-[#5F6FFF]"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleReschedule}
              disabled={submitting || !selectedTime}
              className="px-8 py-3 bg-[#5F6FFF] text-white rounded-full text-sm font-medium hover:bg-[#4a5ce6] disabled:opacity-50 transition"
            >
              {submitting ? "Rescheduling..." : "Confirm Reschedule"}
            </button>
            <button
              onClick={() => router.push("/my-appointments")}
              className="px-8 py-3 border border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:border-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
