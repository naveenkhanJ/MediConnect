import { AppointmentProvider } from "../providers/appointment.provider.js";

// ─── GET today's confirmed appointments ──────────────────────────────────────
export const getTodayAppointmentsController = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await AppointmentProvider.getDoctorAppointments(doctorId);
    res.json(appointments);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ message: err.message });
  }
};

// GET pending appointments
export const getPendingAppointmentsController = async (req, res) => {
  try {
    const doctorId = req.user.id;
    console.log("DOCTOR PENDING APPOINTMENTS REQUEST FOR ID:", doctorId);

    const appointments = await AppointmentProvider.getPendingAppointments(doctorId);
    console.log("FOUND PENDING APPOINTMENTS:", appointments.length);

    res.json(appointments);
  } catch (err) {
    console.error("ERROR FETCHING PENDING:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Approved / Reject appointment
export const decideAppointmentController = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { appointmentId } = req.params;
    const { status } = req.body;

    const result = await AppointmentProvider.updateAppointmentDecision(
      appointmentId,
      doctorId,
      status
    );

    res.json({
      message: `Appointment ${status} successfully`,
      appointment: result
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};