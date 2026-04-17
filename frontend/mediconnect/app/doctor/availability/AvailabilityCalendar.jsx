"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

import { apiUrl } from "@/lib/api";

const API = apiUrl("/api/availability");

export default function AvailabilityCalendar() {
  const [events, setEvents] = useState([]);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  const doctorId = user?.id || "doc124";

  // ================= LOAD =================
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.get(API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const now = new Date();

      const formatted = res.data.map((slot) => {
        const start = new Date(`${slot.date}T${slot.startTime}`);
        const end = new Date(`${slot.date}T${slot.endTime}`);
        const isPast = end < now;

        return {
          id: slot.id || slot._id,
          title: "Available",
          start,
          end,

          // 🎨 COLORS
          backgroundColor: isPast ? "#D3D3D3" : "#5F6FFF",
          borderColor: isPast ? "#D3D3D3" : "#5F6FFF",
          textColor: isPast ? "#666" : "#fff",

          extendedProps: {
            isPast,
          },
        };
      });

      setEvents(formatted);
    } catch (err) {
      console.log("Fetch error:", err.message);
    }
  };

  // ================= CREATE =================
  // Helper: format date as YYYY-MM-DD using LOCAL timezone (not UTC)
  const localDateStr = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const handleDateSelect = async (info) => {
    info.view.calendar.unselect();
    const start = new Date(info.start);
    const end = new Date(info.end);

    // block past slots (with 5-min grace)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (start < fiveMinAgo) {
      alert("Cannot create slots in the past");
      return;
    }

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.post(
        API,
        {
          date: localDateStr(start),
          startTime: start.toTimeString().slice(0, 5),
          endTime: end.toTimeString().slice(0, 5),
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      fetchAvailability();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating slot");
    }
  };

  // ================= DELETE =================
  const handleEventClick = async (info) => {
    const isPast = info.event.extendedProps.isPast;

    if (isPast) {
      alert("Past slots cannot be modified");
      return;
    }

    if (!confirm("Delete this slot?")) return;

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.delete(`${API}/${info.event.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchAvailability();
    } catch (err) {
      console.log(err.message);
    }
  };

  // ================= DRAG =================
  const handleEventDrop = async (info) => {
    const isPast = info.event.extendedProps.isPast;

    if (isPast) {
      alert("Cannot move past slots");
      info.revert();
      return;
    }

    const start = new Date(info.event.start);
    const end = new Date(info.event.end);

    if (start < new Date()) {
      alert("Cannot move to past");
      info.revert();
      return;
    }

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.put(
        `${API}/${info.event.id}`,
        {
          date: localDateStr(start),
          startTime: start.toTimeString().slice(0, 5),
          endTime: end.toTimeString().slice(0, 5),
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      fetchAvailability();
    } catch (err) {
      info.revert();
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // ================= RESIZE =================
  const handleEventResize = async (info) => {
    const isPast = info.event.extendedProps.isPast;

    if (isPast) {
      alert("Cannot edit past slots");
      info.revert();
      return;
    }

    const start = new Date(info.event.start);
    const end = new Date(info.event.end);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.put(
        `${API}/${info.event.id}`,
        {
          date: localDateStr(start),
          startTime: start.toTimeString().slice(0, 5),
          endTime: end.toTimeString().slice(0, 5),
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      fetchAvailability();
    } catch (err) {
      info.revert();
      alert(err.response?.data?.message || "Resize failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"

        selectable={true}
        editable={true}
        selectMirror={true}
        nowIndicator={true}

        // disable selecting past
        selectAllow={(info) => info.start >= new Date()}

        // disable dragging to past
        eventAllow={(dropInfo) => dropInfo.start >= new Date()}

        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}

        events={events}
        height="80vh"
      />
    </div>
  );
}