const PATIENTS_BASE_URL = "http://localhost:4000/patients";

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyPatientProfile(token) {
  const res = await fetch(`${PATIENTS_BASE_URL}/me`, {
    headers: authHeaders(token),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg = data?.message || "Failed to load profile.";
    throw new Error(msg);
  }
  return data;
}

export async function updateMyPatientProfile(token, patientId, payload) {
  const res = await fetch(`${PATIENTS_BASE_URL}/${patientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg = data?.message || "Failed to update profile.";
    throw new Error(msg);
  }
  return data;
}

export async function deleteMyPatientAccount(token, patientId) {
  const res = await fetch(`${PATIENTS_BASE_URL}/${patientId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg = data?.message || "Failed to delete account.";
    throw new Error(msg);
  }
  return data;
}
