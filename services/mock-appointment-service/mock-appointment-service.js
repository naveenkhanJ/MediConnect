// mockAppointmentService.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Mock database
let appointments = [
    {
        id: "4",
        doctorId: "doc124",
        patientName: "John Doe",
        appointmentDate: "2026-04-06",
        timeSlot: "10:00 AM",
        status: "PENDING",
        paymentStatus: "PENDING",
    },
    {
        id: "5",
        doctorId: "doc124",
        patientName: "Jane Smith",
        appointmentDate: "2026-04-06",
        timeSlot: "11:00 AM",
        status: "PENDING",
        paymentStatus: "PAID",
    },
    {
        id: "6",
        doctorId: "doc124",
        patientName: "Alice Brown",
        appointmentDate: "2026-04-07",
        timeSlot: "09:30 AM",
        status: "PENDING",
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
app.patch("/api/appointments/:appointmentId/status", (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const apptIndex = appointments.findIndex((a) => a.id === appointmentId);
    if (apptIndex === -1) return res.status(404).json({ message: "Appointment not found" });

    appointments[apptIndex].status = status;

     res.json(appointments[apptIndex]);
});

// Start server
app.listen(PORT, () => {
    console.log(`Mock Appointment Service running at http://localhost:${PORT}`);
});