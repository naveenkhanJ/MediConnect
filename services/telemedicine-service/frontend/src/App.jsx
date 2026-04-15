import React, { useMemo, useState } from "react";
import {
  createSession,
  endSession,
  getSessionById,
  joinSession,
  listSessions,
  startSession,
} from "./api.js";

function JsonViewer({ value }) {
  const text = useMemo(() => JSON.stringify(value, null, 2), [value]);
  return <pre className="json">{text}</pre>;
}

export default function App() {
  const [auth, setAuth] = useState({ userId: "201", role: "PATIENT" });
  const [appointmentId, setAppointmentId] = useState("123");
  const [patientEmail, setPatientEmail] = useState("patient@example.com");
  const [patientPhone, setPatientPhone] = useState("+94700000000");
  const [doctorEmail, setDoctorEmail] = useState("doctor@example.com");
  const [sessionId, setSessionId] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const run = async (fn) => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const data = await fn();
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
          <div className="subtitle">Telemedicine Service Test UI</div>
        </div>
      </header>

      <section className="card">
        <div className="cardTitle">Auth headers</div>
        <div className="grid">
          <label className="field">
            <div className="label">X-User-Id</div>
            <input
              value={auth.userId}
              onChange={(e) => setAuth((s) => ({ ...s, userId: e.target.value }))}
              placeholder="201"
            />
          </label>
          <label className="field">
            <div className="label">X-User-Role</div>
            <select
              value={auth.role}
              onChange={(e) => setAuth((s) => ({ ...s, role: e.target.value }))}
            >
              <option value="PATIENT">PATIENT</option>
              <option value="DOCTOR">DOCTOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
        </div>
        <div className="hint">
          Backend uses demo auth via <code>X-User-Id</code> and <code>X-User-Role</code>.
        </div>
      </section>

      <section className="card">
        <div className="cardTitle">Make appointment (telemedicine)</div>
        <div className="grid">
          <label className="field">
            <div className="label">Appointment ID</div>
            <input
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              placeholder="123"
            />
          </label>
          <label className="field">
            <div className="label">Patient email</div>
            <input
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="patient@example.com"
            />
          </label>
          <label className="field">
            <div className="label">Patient phone</div>
            <input
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="+94..."
            />
          </label>
          <label className="field">
            <div className="label">Doctor email (optional)</div>
            <input
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              placeholder="doctor@example.com"
            />
          </label>
          <div className="field">
            <div className="label">Actions</div>
            <div className="row">
              <button
                className="btn primary"
                disabled={busy}
                onClick={() =>
                  run(() =>
                    createSession(auth, {
                      appointmentId,
                      patientEmail,
                      patientPhone,
                      doctorEmail: doctorEmail || undefined,
                    })
                  )
                }
              >
                Confirm & create session
              </button>
              <button
                className="btn"
                disabled={busy}
                onClick={() => run(() => listSessions(auth))}
              >
                List sessions
              </button>
            </div>
          </div>
        </div>
        <div className="hint">
          If <code>USE_MOCK_APPOINTMENT=true</code>, any appointmentId will work (status is mocked as CONFIRMED).
        </div>
      </section>

      <section className="card">
        <div className="cardTitle">Session operations</div>
        <div className="grid">
          <label className="field">
            <div className="label">Session ID</div>
            <input
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="3"
            />
          </label>
          <div className="field">
            <div className="label">Actions</div>
            <div className="row">
              <button
                className="btn"
                disabled={busy || !sessionId}
                onClick={() => run(() => getSessionById(auth, sessionId))}
              >
                Get
              </button>
              <button
                className="btn primary"
                disabled={busy || !sessionId}
                onClick={() => run(() => startSession(auth, sessionId))}
              >
                Start
              </button>
              <button
                className="btn primary"
                disabled={busy || !sessionId}
                onClick={() => run(() => endSession(auth, sessionId))}
              >
                End
              </button>
              <button
                className="btn"
                disabled={busy || !sessionId}
                onClick={() => run(() => joinSession(auth, sessionId))}
              >
                Join (get link)
              </button>
              <button
                className="btn"
                disabled={busy}
                onClick={() => {
                  setError(null);
                  setResult(null);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section className="card">
          <div className="error">Error: {error}</div>
        </section>
      )}

      {result && (
        <section className="card">
          <div className="cardTitle">Response</div>
          <JsonViewer value={result} />
        </section>
      )}

      <footer className="footer">
        Requests go to <code>http://localhost:5005</code> via Vite proxy.
      </footer>
    </div>
  );
}

