const REPORTS_BASE_URL = "http://localhost:4000/patients/reports";

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

export async function getMyReports(token) {
  const res = await fetch(REPORTS_BASE_URL, {
    headers: authHeaders(token),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg = data?.message || "Failed to load reports.";
    throw new Error(msg);
  }
  return Array.isArray(data) ? data : [];
}

export async function uploadMyReport(token, { report_name, description, file }) {
  const form = new FormData();
  form.append("report_name", report_name || "");
  form.append("description", description || "");
  if (file) form.append("file", file);

  const res = await fetch(REPORTS_BASE_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg = data?.message || "Failed to upload report.";
    throw new Error(msg);
  }
  return data;
}

