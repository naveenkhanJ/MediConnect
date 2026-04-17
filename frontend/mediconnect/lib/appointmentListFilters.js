function normalize(s) {
  return String(s ?? "").toLowerCase();
}

export function matchesSearchQuery(appointment, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    appointment.name,
    appointment.department,
    appointment.email,
    appointment.phone,
    appointment.date,
    appointment.id != null ? String(appointment.id) : "",
  ]
    .map(normalize)
    .join(" ");

  return haystack.includes(q);
}

export function matchesActiveFilter(appointment, activeFilter) {
  if (activeFilter === "All") return true;

  if (activeFilter === "Confirmed") return appointment.status === "Confirmed";
  if (activeFilter === "Pending") return appointment.status === "Pending";
  if (activeFilter === "Cancelled") return appointment.status === "Cancelled";

  if (activeFilter === "Upcoming") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(appointment.date);
    return (
      !Number.isNaN(apptDate.getTime()) &&
      apptDate > today &&
      appointment.status !== "Cancelled"
    );
  }

  return true;
}

/** `selectedDateYmd` is `YYYY-MM-DD` from `<input type="date" />`, or "" to disable. */
export function matchesSelectedDate(appointment, selectedDateYmd) {
  if (!selectedDateYmd || String(selectedDateYmd).trim() === "") return true;
  const d = new Date(appointment.date);
  if (Number.isNaN(d.getTime())) return false;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}` === selectedDateYmd;
}

export function filterAppointments(appointments, {
  searchQuery,
  activeFilter,
  selectedDate = "",
}) {
  return appointments.filter(
    (item) =>
      matchesActiveFilter(item, activeFilter) &&
      matchesSearchQuery(item, searchQuery) &&
      matchesSelectedDate(item, selectedDate)
  );
}

/** Tab labels with counts derived from the current list (no hard-coded numbers). */
export function getAppointmentFilterTabs(appointments) {
  const list = Array.isArray(appointments) ? appointments : [];
  return [
    { name: "All", count: list.length },
    {
      name: "Confirmed",
      count: list.filter((a) => a.status === "Confirmed").length,
    },
    { name: "Pending", count: list.filter((a) => a.status === "Pending").length },
    {
      name: "Cancelled",
      count: list.filter((a) => a.status === "Cancelled").length,
    },
    {
      name: "Upcoming",
      count: list.filter((a) => matchesActiveFilter(a, "Upcoming")).length,
    },
  ];
}
