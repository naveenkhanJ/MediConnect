async function readJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

function headersFromAuth(auth) {
  return {
    "Content-Type": "application/json",
    "X-User-Id": String(auth.userId || 1),
    "X-User-Role": String(auth.role || "PATIENT"),
  };
}

export async function createSession(auth, payload) {
  const res = await fetch("/api/v1/sessions", {
    method: "POST",
    headers: headersFromAuth(auth),
    body: JSON.stringify(payload),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "Create session failed");
  return data;
}

export async function listSessions(auth) {
  const res = await fetch("/api/v1/sessions", {
    headers: headersFromAuth(auth),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "List sessions failed");
  return data;
}

export async function getSessionById(auth, id) {
  const res = await fetch(`/api/v1/sessions/${encodeURIComponent(id)}`, {
    headers: headersFromAuth(auth),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "Get session failed");
  return data;
}

export async function startSession(auth, id) {
  const res = await fetch(`/api/v1/sessions/${encodeURIComponent(id)}/start`, {
    method: "PATCH",
    headers: headersFromAuth(auth),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "Start failed");
  return data;
}

export async function endSession(auth, id) {
  const res = await fetch(`/api/v1/sessions/${encodeURIComponent(id)}/end`, {
    method: "PATCH",
    headers: headersFromAuth(auth),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "End failed");
  return data;
}

export async function joinSession(auth, id) {
  const res = await fetch(`/api/v1/sessions/${encodeURIComponent(id)}/join`, {
    method: "POST",
    headers: headersFromAuth(auth),
    body: JSON.stringify({}),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data?.message || "Join failed");
  return data;
}

