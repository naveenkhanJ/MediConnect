const BASE = "http://localhost:4000/patients";

async function parseJson(res) {
  try { return await res.json(); } catch { return null; }
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function getMyPatientProfile(token) {
  const res = await fetch(`${BASE}/me`, { headers: authHeaders(token) });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.message || "Failed to load profile.");
  return data;
}

export async function updateMyPatientProfile(token, patientId, payload) {
  const res = await fetch(`${BASE}/${patientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.message || "Failed to update profile.");
  return data;
}

export async function deleteMyPatientAccount(token, patientId) {
  const res = await fetch(`${BASE}/${patientId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.message || "Failed to delete account.");
  return data;
}
