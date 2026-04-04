"use client"; // ← MUST be here at the top

import AppointmentView from "@/components/AppointmentView";
import { useAppointment } from "@/hooks/useAppointment";
import { useParams } from "next/navigation"; // optional if getting docId from route
import { doctors } from "@/assets/data"; // ✅ Import doctors data

export default function AppointmentPage() {
  const params = useParams();
  const docId = params.docId; // get docId from URL

  // ✅ Call the hook inside the component
  const {
    docInfo,
    docSlot,
    selectedDate,
    setSelectedDate,
    slotTime,
    setSlotTime,
  } = useAppointment(doctors, docId);

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