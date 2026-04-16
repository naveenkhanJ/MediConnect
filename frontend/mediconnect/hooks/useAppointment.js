"use client";

import { useState, useEffect } from "react";

const API = "http://localhost:4000";

// Generate 30-min slots between startTime and endTime ("HH:MM" format)
function generateSlots(dateStr, startTime, endTime) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  const start = new Date(dateStr);
  start.setHours(sh, sm, 0, 0);

  const end = new Date(dateStr);
  end.setHours(eh, em, 0, 0);

  const now = new Date();
  const slots = [];
  const cursor = new Date(start);

  while (cursor < end) {
    if (cursor > now) {
      slots.push({
        datetime: new Date(cursor),
        time: cursor.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
    }
    cursor.setMinutes(cursor.getMinutes() + 30);
  }
  return slots;
}

export const useAppointment = (docId) => {
  const [docInfo, setDocInfo]       = useState(null);
  const [docSlot, setDocSlot]       = useState([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [slotTime, setSlotTime]     = useState("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!docId) return;

    const fetchDoctorAndAvailability = async () => {
      setLoading(true);
      setError(null);
      try {
        const [docRes, availRes] = await Promise.all([
          fetch(`${API}/api/doctors/${docId}`),
          fetch(`${API}/api/doctors/${docId}/availability`)
        ]);

        if (!docRes.ok) throw new Error("Doctor not found");
        const doctor = await docRes.json();
        setDocInfo(doctor);

        const availability = availRes.ok ? await availRes.json() : [];

        // Build slot groups from availability records
        const slotGroups = availability
          .map((avail) => {
            const slots = generateSlots(avail.date, avail.startTime, avail.endTime);
            return slots.length > 0 ? { date: new Date(avail.date), slots } : null;
          })
          .filter(Boolean);

        setDocSlot(slotGroups);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndAvailability();
  }, [docId]);

  return {
    docInfo,
    docSlot,
    selectedDate,
    setSelectedDate,
    slotTime,
    setSlotTime,
    loading,
    error
  };
};
