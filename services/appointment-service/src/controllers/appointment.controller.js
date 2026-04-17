import {
  searchDoctorsService,
  createAppointmentService,
  rescheduleAppointmentService,
  cancelAppointmentService,
  getAppointmentStatusService,
  getMyAppointmentsService,
  confirmPaymentService,
  getAppointmentByIdService,
  getDoctorPendingAppointmentsService,
  handleDoctorDecisionService,
  getDoctorTodayAppointmentsService
} from "../services/appointment.service.js";
import { findAppointmentById, updateAppointment } from "../repositories/appointment.repository.js";

export const searchDoctorsController = async (req, res) => {
  try {
    const doctors = await searchDoctorsService(req.query.specialty);
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createAppointmentController = async (req, res) => {
  try {
    // Cast IDs to String to avoid PostgreSQL 'character varying = integer' errors
    const patientId = String(req.user ? req.user.id : req.body.patientId);
    const doctorId  = String(req.body.doctorId);
    const result = await createAppointmentService({
      patientId,
      doctorId,
      appointmentDate: req.body.appointmentDate,
      timeSlot: req.body.timeSlot,
      consultationType: req.body.consultationType || "ONLINE"
    });

    res.status(201).json({
      message: "Appointment created successfully",
      ...result
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rescheduleAppointmentController = async (req, res) => {
  try {
    const appointment = await rescheduleAppointmentService({
      appointmentId: req.params.id,
      appointmentDate: req.body.appointmentDate,
      timeSlot: req.body.timeSlot
    });

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelAppointmentController = async (req, res) => {
  try {
    const appointment = await cancelAppointmentService(req.params.id);

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAppointmentStatusController = async (req, res) => {
  try {
    const result = await getAppointmentStatusService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getMyAppointmentsController = async (req, res) => {
  try {
    const appointments = await getMyAppointmentsService(String(req.user.id));
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmPaymentController = async (req, res) => {
  try {
    const appointment = await confirmPaymentService({
      appointmentId: req.params.id,
      paymentId: req.body.paymentId
    });

    res.status(200).json({
      message: "Appointment confirmed after payment",
      appointment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const failPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await findAppointmentById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    appointment.status = "CANCELLED";
    await updateAppointment(appointment);

    res.status(200).json({
      message: "Appointment cancelled due to payment failure",
      appointment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAppointmentByIdController = async (req, res) => {
  try {
    const appointment = await getAppointmentByIdService(req.params.id);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDoctorPendingAppointmentsController = async (req, res) => {
  try {
    const doctorIdStr = String(req.params.doctorId);
    console.log("FETCHING CONFIRMED APPOINTMENTS FOR DOCTOR ID:", doctorIdStr);
    const appointments = await getDoctorPendingAppointmentsService(doctorIdStr);
    console.log("FOUND APPOINTMENTS:", appointments.length);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("ERROR IN PENDING APPOINTMENTS:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const handleDoctorDecisionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Cast doctorId to String to fix VARCHAR vs integer comparison
    const doctorId = String(req.body.doctorId);

    if (!doctorId || !status) {
      return res.status(400).json({ message: "doctorId and status are required" });
    }

    const appointment = await handleDoctorDecisionService({ appointmentId: id, doctorId, status });
    res.status(200).json({
      message: `Appointment ${status.toLowerCase()} successfully`,
      appointment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDoctorTodayAppointmentsController = async (req, res) => {
  try {
    const appointments = await getDoctorTodayAppointmentsService(String(req.params.doctorId));
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};