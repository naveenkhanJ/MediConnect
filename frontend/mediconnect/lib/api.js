const GATEWAY = "http://localhost:4000";

export function apiUrl(path) {
  return `${GATEWAY}${path}`;
}

export async function apiFetch(path, { auth = false, method = "GET", body, headers = {} } = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${GATEWAY}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body } : {}),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data?.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
