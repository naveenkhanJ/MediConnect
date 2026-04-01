import {
  searchDoctorsService,
  createAppointmentService,
  rescheduleAppointmentService,
  cancelAppointmentService,
  getAppointmentStatusService,
  getMyAppointmentsService,
  confirmPaymentService
} from "../services/appointment.service.js";

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
    const patientId = req.user ? req.user.id : req.body.patientId;
    const result = await createAppointmentService({
      patientId,
      doctorId: req.body.doctorId,
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
    const appointments = await getMyAppointmentsService(req.user.id);
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