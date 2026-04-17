// mockAppointmentService.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();
const PORT = 5003;

app.use(cors());
app.use(bodyParser.json());

// Mock database
let appointments = [
    {
        id: "4",
        doctorId: "d5aeffa5-4623-4d93-9fc3-3b971e72751d",
      patientId: "pat003",
        appointmentDate: "2026-04-16",
        timeSlot: "10:00 AM",
        status: "PENDING",
        paymentStatus: "Confirmed",
    },
    {
        id: "5",
        doctorId: "doc124",
        patientId: "pat002",
        appointmentDate: "2026-04-06",
        timeSlot: "11:00 AM",
        status: "PENDING",
        paymentStatus: "PAID",
    },
    {
        id: "6",
        doctorId: "d5aeffa5-4623-4d93-9fc3-3b971e72751d",
        patientId: "pat003",
        appointmentDate: "2026-04-16",
        timeSlot: "09:30 AM",
        status: "PENDING",
        paymentStatus: "FAILED",
    }, {
        id: "10",
        doctorId: "d5aeffa5-4623-4d93-9fc3-3b971e72751d",
        patientId: "pat003",
        appointmentDate: "2026-04-16",
        timeSlot: "09:30 AM",
        status: "CONFIRMED",
        paymentStatus: "FAILED",
    },
    {
        id: "7",
        doctorId: "doc124",
        patientId: "pat001",
        appointmentDate: "2026-04-16",
        timeSlot: "09:30 AM",
        status: "CONFIRMED",
        paymentStatus: "FAILED",
    },
];

// Fetch pending appointments for a doctor
app.get("/api/appointments/doctor/:doctorId/pending", (req, res) => {
    const { doctorId } = req.params;
    const pendingAppointments = appointments.filter(
        (appt) => appt.doctorId === doctorId && appt.status === "PENDING"
    );
    res.json(pendingAppointments);
});

// Approve an appointment
app.patch("/api/appointments/:appointmentId/decision", (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const apptIndex = appointments.findIndex((a) => a.id === appointmentId);
    if (apptIndex === -1) return res.status(404).json({ message: "Appointment not found" });

    appointments[apptIndex].status = status;

     res.json(appointments[apptIndex]);
});

app.get("/api/appointments/:id", (req, res) => {
  const appointment = appointments.find(a => a.id === req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }
  res.json(appointment);
});

// ADD THIS HERE
app.get("/api/appointments/doctor/:doctorId", (req, res) => {
    const { doctorId } = req.params;

    const doctorAppointments = appointments.filter(
        (appt) => appt.doctorId === doctorId
    );

    res.json(doctorAppointments);
});
// GET MY APPOINTMENTS (used by frontend via gateway)
app.get("/api/appointments/my/list", (req, res) => {
    const doctorId = req.headers["x-patient-id"]; // (you reused header)

    const myAppointments = appointments.filter(
        (a) => a.doctorId === doctorId
    );

    res.json(myAppointments);
});
// Start server
app.listen(PORT, () => {
    console.log(`Mock Appointment Service running at http://localhost:${PORT}`);
});