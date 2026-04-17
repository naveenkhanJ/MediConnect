"use client";

import { useState, useEffect } from "react";

const API = "http://localhost:4000";

// Generate 30-min slots between startTime and endTime ("HH:MM" format)
function generateSlots(dateStr, startTime, endTime) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  // Parse date parts manually to avoid timezone issues
  const [year, month, day] = dateStr.split("-").map(Number);

  const start = new Date(year, month - 1, day, sh, sm, 0, 0);
  const end   = new Date(year, month - 1, day, eh, em, 0, 0);

  // For filtering: use current time minus a small buffer so the current slot is still bookable
  const now = new Date();
  now.setMinutes(now.getMinutes() - 5); // allow 5-min grace

  const slots = [];
  const cursor = new Date(start);

  while (cursor < end) {
    if (cursor >= now) {
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

        // Build slot groups from availability records.
        // Include today even if all slots are in the past (show "No more slots today")
        const slotGroups = availability
          .map((avail) => {
            const slots = generateSlots(avail.date, avail.startTime, avail.endTime);
            // Always include the date, even if no future slots remain (slots array is empty)
            return { date: new Date(`${avail.date}T00:00:00`), slots, dateStr: avail.date };
          })
          // Deduplicate by dateStr (in case a doctor has multiple entries for same date)
          .reduce((acc, cur) => {
            const existing = acc.find(g => g.dateStr === cur.dateStr);
            if (existing) {
              existing.slots.push(...cur.slots);
            } else {
              acc.push(cur);
            }
            return acc;
          }, [])
          // Sort by date ascending
          .sort((a, b) => a.date - b.date);

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
