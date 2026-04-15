import {
  notifyAppointmentBooked,
  notifyConsultationCompleted,
} from "../services/notification.service.js";

export async function appointmentBooked(req, res, next) {
  try {
    const { appointmentId, patientEmail, patientPhone } = req.body || {};
    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "appointmentId is required" });
    }
    if (!patientEmail && !patientPhone) {
      return res.status(400).json({
        success: false,
        message: "patientEmail or patientPhone is required",
      });
    }

    const result = await notifyAppointmentBooked(req.body);
    return res.status(200).json({ success: true, message: "Notification processed", result });
  } catch (err) {
    next(err);
  }
}

export async function consultationCompleted(req, res, next) {
  try {
    const { appointmentId, patientEmail, patientPhone } = req.body || {};
    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "appointmentId is required" });
    }
    if (!patientEmail && !patientPhone) {
      return res.status(400).json({
        success: false,
        message: "patientEmail or patientPhone is required",
      });
    }

    const result = await notifyConsultationCompleted(req.body);
    return res.status(200).json({ success: true, message: "Notification processed", result });
  } catch (err) {
    next(err);
  }
}

