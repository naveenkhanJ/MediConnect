import React, { useMemo, useState } from "react";
import {
  getHealth,
  postAppointmentBooked,
  postConsultationCompleted,
} from "./api.js";

function JsonViewer({ value }) {
  const text = useMemo(() => JSON.stringify(value, null, 2), [value]);
  return <pre className="json">{text}</pre>;
}

function summarizeResult(data) {
  const emailResults = data?.result?.emailResults || [];
  const smsResults = data?.result?.smsResult || [];

  const emailSent = emailResults.filter((r) => r?.ok).length;
  const emailFailed = emailResults.filter((r) => r && !r.ok).length;
  const smsSent = smsResults.filter((r) => r?.ok).length;
  const smsFailed = smsResults.filter((r) => r && !r.ok).length;

  const errors = [];
  for (const r of emailResults) {
    const reason = r?.meta?.reason;
    if (r && !r.ok && reason) errors.push(`Email to ${r.to}: ${reason}`);
  }
  for (const r of smsResults) {
    const msg = r?.error;
    if (r && !r.ok && msg) errors.push(`SMS to ${r.to}: ${msg}`);
  }

  return {
    emailSent,
    emailFailed,
    smsSent,
    smsFailed,
    errors,
  };
}

function isValidEmail(s) {
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}

function isValidPhone(s) {
  if (!s) return true;
  return /^\+?[0-9\s-]{7,20}$/.test(String(s).trim());
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [tab, setTab] = useState("BOOKED"); // BOOKED | COMPLETED
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [form, setForm] = useState({
    appointmentId: "123",
    meetingLink: "https://meet.jit.si/demo",
    patientEmail: "patient@example.com",
    patientPhone: "+94700000000",
    doctorEmail: "doctor@example.com",
  });

  const loadHealth = async () => {
    setBusy(true);
    setHealthError(null);
    try {
      const data = await getHealth();
      setHealth(data);
    } catch (e) {
      setHealth(null);
      setHealthError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const validate = () => {
    const appt = Number(form.appointmentId);
    if (!Number.isFinite(appt) || appt <= 0) return "Appointment ID must be a number";
    if (!isValidEmail(form.patientEmail)) return "Patient email is invalid";
    if (!isValidPhone(form.patientPhone)) return "Patient phone is invalid";
    if (showAdvanced && !isValidEmail(form.doctorEmail)) return "Doctor email is invalid";
    if (tab === "BOOKED" && form.meetingLink && !String(form.meetingLink).startsWith("http")) {
      return "Meeting link must start with http/https";
    }
    return null;
  };

  const send = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const validationError = validate();
      if (validationError) throw new Error(validationError);

      const payloadBase = {
        appointmentId: Number(form.appointmentId),
        patientEmail: form.patientEmail || undefined,
        patientPhone: form.patientPhone || undefined,
        doctorEmail: showAdvanced ? form.doctorEmail || undefined : undefined,
      };

      const data =
        tab === "BOOKED"
          ? await postAppointmentBooked({
              ...payloadBase,
              meetingLink: form.meetingLink || undefined,
            })
          : await postConsultationCompleted(payloadBase);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <div className="title">MediConnect</div>
          <div className="subtitle">Notifications</div>
        </div>
        <div className="row">
          <button
            className="btn"
            onClick={() => {
              setResult(null);
              setError(null);
              loadHealth();
            }}
            disabled={busy}
          >
            Refresh status
          </button>
          <button className="btn" onClick={loadHealth} disabled={busy}>
            Check health
          </button>
        </div>
      </header>

      <section className="card">
        <div className="cardTitle">Service status</div>
        <div className="statusRow">
          <div className="pill">
            <span className="pillLabel">Backend</span>
            <span className={health ? "pillOk" : "pillWarn"}>
              {health ? "Online" : "Unknown"}
            </span>
          </div>
          <div className="muted">
            Target: <code>http://localhost:5006</code>
          </div>
        </div>
        {healthError && <div className="error">Health error: {healthError}</div>}
      </section>

      <section className="card">
        <div className="cardTitle">Send a notification</div>

        <div className="tabs">
          <button
            className={tab === "BOOKED" ? "tab active" : "tab"}
            disabled={busy}
            onClick={() => {
              setTab("BOOKED");
              setResult(null);
              setError(null);
            }}
          >
            Appointment confirmed
          </button>
          <button
            className={tab === "COMPLETED" ? "tab active" : "tab"}
            disabled={busy}
            onClick={() => {
              setTab("COMPLETED");
              setResult(null);
              setError(null);
            }}
          >
            Consultation completed
          </button>
        </div>

        <div className="grid">
          <label className="field">
            <div className="label">Appointment ID *</div>
            <input
              value={form.appointmentId}
              onChange={(e) => setForm((s) => ({ ...s, appointmentId: e.target.value }))}
              placeholder="123"
              inputMode="numeric"
            />
          </label>

          <label className="field">
            <div className="label">Patient email</div>
            <input
              value={form.patientEmail}
              onChange={(e) => setForm((s) => ({ ...s, patientEmail: e.target.value }))}
              placeholder="patient@example.com"
            />
          </label>

          <label className="field">
            <div className="label">Patient phone</div>
            <input
              value={form.patientPhone}
              onChange={(e) => setForm((s) => ({ ...s, patientPhone: e.target.value }))}
              placeholder="+947..."
            />
          </label>

          {tab === "BOOKED" && (
            <label className="field">
              <div className="label">Meeting link (for online)</div>
              <input
                value={form.meetingLink}
                onChange={(e) => setForm((s) => ({ ...s, meetingLink: e.target.value }))}
                placeholder="https://meet.jit.si/..."
              />
            </label>
          )}
        </div>

        <div className="row between">
          <label className="toggle">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={(e) => setShowAdvanced(e.target.checked)}
              disabled={busy}
            />
            <span>Advanced (doctor email)</span>
          </label>
          <button
            className="btn"
            onClick={() => {
              setResult(null);
              setError(null);
              setForm((s) => ({
                ...s,
                appointmentId: "123",
                meetingLink: "https://meet.jit.si/demo",
                patientEmail: "patient@example.com",
                patientPhone: "+94700000000",
                doctorEmail: "doctor@example.com",
              }));
            }}
            disabled={busy}
          >
            Reset form
          </button>
        </div>

        {showAdvanced && (
          <div className="grid advanced">
            <label className="field">
              <div className="label">Doctor email</div>
              <input
                value={form.doctorEmail}
                onChange={(e) => setForm((s) => ({ ...s, doctorEmail: e.target.value }))}
                placeholder="doctor@example.com"
              />
            </label>
          </div>
        )}

        <div className="row">
          <button className="btn primary" onClick={send} disabled={busy}>
            {busy ? "Sending..." : "Send notification"}
          </button>
          <button
            className="btn"
            onClick={() => {
              setResult(null);
              setError(null);
            }}
            disabled={busy}
          >
            Clear
          </button>
        </div>

        {error && <div className="error">Error: {error}</div>}
        {result && (
          <>
            {(() => {
              const s = summarizeResult(result);
              const anyFailed = s.emailFailed + s.smsFailed > 0;
              const anySent = s.emailSent + s.smsSent > 0;
              const headline = anyFailed
                ? "Delivered with errors"
                : anySent
                  ? "Delivered"
                  : "Processed (no deliveries)";
              return (
                <div className={anyFailed ? "error" : "hint"}>
                  {headline}. Email: {s.emailSent} sent / {s.emailFailed} failed. SMS: {s.smsSent} sent /{" "}
                  {s.smsFailed} failed.
                  {s.errors.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontWeight: 750 }}>Failure reasons</div>
                      <ul style={{ margin: "6px 0 0 18px" }}>
                        {s.errors.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
            <JsonViewer value={result} />
          </>
        )}
        {!result && !error && (
          <div className="hint">
            Tip: configure SMTP/Twilio in <code>notification-service/.env</code> to send real messages.
          </div>
        )}
      </section>

      <footer className="footer">
        Requests go to <code>http://localhost:5006</code> via the dev proxy.
      </footer>
    </div>
  );
}

