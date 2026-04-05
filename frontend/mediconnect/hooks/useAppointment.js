"use client";

import { useState, useEffect } from "react";

export const useAppointment = (doctors, docId) => {
  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const getAvailableSlots = () => {
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(
          today.getHours() > 10 ? today.getHours() + 1 : 10
        );
        currentDate.setMinutes(0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push({
        date: new Date(currentDate),
        slots: timeSlots,
      });
    }

    setDocSlot(allSlots);
  };

  useEffect(() => {
    if (doctors && docId) {
      const found = doctors.find(
        (doc) => String(doc._id) === String(docId)
      );
      setDocInfo(found);
    }
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, []);

  return {
    docInfo,
    docSlot,
    selectedDate,
    setSelectedDate,
    slotTime,
    setSlotTime,
  };
};