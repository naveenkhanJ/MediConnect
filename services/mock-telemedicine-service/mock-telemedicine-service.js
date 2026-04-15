import express from "express";
import cors from "cors";

const app = express();
const PORT = 5007;

app.use(cors());
app.use(express.json());

// mock DB
let sessions = [];

/**
 * CREATE SESSION
 */
app.post("/api/v1/sessions", (req, res) => {
  const { appointmentId, doctorName, patientName } = req.body;

  const session = {
    id: String(sessions.length + 1),
    appointmentId,
    doctorName,
    patientName,
    roomId: `room-${appointmentId}`,
    meetingLink: `https://meet.jit.si/room-${appointmentId}`,
    jitsiJwt: null,
    status: "SCHEDULED",
    scheduledAt: new Date(),
  };

  sessions.push(session);

  res.status(201).json({
    message: "Telemedicine session created successfully",
    data: session,
  });
});

/**
 * GET ALL SESSIONS
 */
app.get("/api/v1/sessions", (req, res) => {
  res.json({
    message: "Sessions fetched successfully",
    data: sessions,
  });
});

/**
 * GET BY ID
 */
app.get("/api/v1/sessions/:id", (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json({
    message: "Session fetched successfully",
    data: session,
  });
});

/**
 * GET BY APPOINTMENT ID
 */
app.get("/api/v1/sessions/appointment/:appointmentId", (req, res) => {
  const session = sessions.find(
    (s) => s.appointmentId === req.params.appointmentId
  );

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json({
    message: "Session fetched successfully",
    data: session,
  });
});

/**
 * START SESSION
 */
app.patch("/api/v1/sessions/:id/start", (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  session.status = "ACTIVE";
  session.startedAt = new Date();

  res.json({
    message: "Session started successfully",
    data: session,
  });
});

/**
 * END SESSION
 */
app.patch("/api/v1/sessions/:id/end", (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  session.status = "COMPLETED";
  session.endedAt = new Date();

  res.json({
    message: "Session ended successfully",
    data: session,
  });
});

/**
 * CANCEL SESSION
 */
app.patch("/api/v1/sessions/:id/cancel", (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  session.status = "CANCELLED";

  res.json({
    message: "Session cancelled successfully",
    data: session,
  });
});

/**
 * JOIN SESSION
 */
app.post("/api/v1/sessions/:id/join", (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json({
    message: "Meeting link fetched successfully",
    data: {
      id: session.id,
      meetingLink: session.meetingLink,
      roomId: session.roomId,
      status: session.status,
    },
  });
});

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.json({
    status: "Mock Telemedicine Service Running",
  });
});

app.listen(PORT, () => {
  console.log(`Mock Telemedicine Service running on http://localhost:${PORT}`);
});