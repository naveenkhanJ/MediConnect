async function readJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

export async function getHealth() {
  const res = await fetch("/health");
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "Health check failed");
  return data;
}

export async function postAppointmentBooked(payload) {
  const res = await fetch("/api/v1/notifications/appointment-booked", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export async function postConsultationCompleted(payload) {
  const res = await fetch("/api/v1/notifications/consultation-completed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

