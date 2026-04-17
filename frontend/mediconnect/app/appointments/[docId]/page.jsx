"use client";

import AppointmentView from "@/components/AppointmentView";
import { useAppointment } from "@/hooks/useAppointment";
import { useParams } from "next/navigation";

export default function AppointmentPage() {
  const { docId } = useParams();

  const {
    docInfo,
    docSlot,
    selectedDate,
    setSelectedDate,
    slotTime,
    setSlotTime,
    loading,
    error
  } = useAppointment(docId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading doctor details...
      </div>
    );
  }

  if (error || !docInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-sm">
        {error || "Doctor not found."}
      </div>
    );
  }

  return (
    <AppointmentView
      docInfo={docInfo}
      docSlot={docSlot}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      slotTime={slotTime}
      setSlotTime={setSlotTime}
    />
  );
}
