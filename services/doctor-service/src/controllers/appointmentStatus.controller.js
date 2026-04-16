import axios from "axios";

const APPOINTMENT_SERVICE_URL =
  process.env.APPOINTMENT_SERVICE_URL || "http://localhost:5003";

  // ─── GET today's confirmed appointments ──────────────────────────────────────
export const getTodayAppointmentsController = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const response = await axios.get(
      `${APPOINTMENT_SERVICE_URL}/api/appointments/doctor/${doctorId}/today`
    );

    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ message: err.message });
  }
};

// GET pending appointments
export const getPendingAppointmentsController = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const response = await axios.get(
      `${APPOINTMENT_SERVICE_URL}/api/appointments/doctor/${doctorId}/pending`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const decideAppointmentController = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { appointmentId } = req.params;
    const { status } = req.body;

    const response = await axios.patch(
      `${APPOINTMENT_SERVICE_URL}/api/appointments/${appointmentId}/decision`,
      {
        doctorId,
        status
      }
    );

    res.json({
      message: `Appointment ${status} successfully`,
      appointment: response.data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};