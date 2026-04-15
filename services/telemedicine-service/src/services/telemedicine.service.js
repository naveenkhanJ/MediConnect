import * as telemedicineRepository from "../repositories/telemedicine.repository.js";
import { getAppointmentById } from "../providers/appointment.provider.js";
import axios from "axios";
import env from "../config/env.js";
import { publishEvent } from "../utils/rabbitmq.util.js";
import { createJitsiMeeting } from "../utils/jitsi.util.js";
import { successResponse } from "../utils/response.util.js";
import { getLogger } from "../utils/logger.util.js";

const logger = getLogger("telemedicine.service");

export const createTelemedicineSession = async (payload) => {
  try {
    logger.info("Creating telemedicine session with payload:", payload);
    const {
      appointmentId,
      doctorName: payloadDoctorName,
      patientName: payloadPatientName,
      patientEmail: payloadPatientEmail,
      patientPhone: payloadPatientPhone,
      doctorEmail: payloadDoctorEmail,
    } = payload;

    if (!appointmentId) {
      const error = new Error("appointmentId is required");
      error.statusCode = 400;
      throw error;
    }

    logger.info("Checking for existing session for appointmentId:", appointmentId);
    const existingSession = await telemedicineRepository.findByAppointmentId(
      appointmentId
    );

    if (existingSession) {
      const error = new Error("Session already exists for this appointment");
      error.statusCode = 409;
      throw error;
    }

    logger.info("Fetching appointment details for appointmentId:", appointmentId);
    const appointment = await getAppointmentById(appointmentId);

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    logger.info("Appointment found:", appointment);

    if (appointment.status !== "CONFIRMED") {
      const error = new Error("Appointment is not confirmed");
      error.statusCode = 400;
      throw error;
    }

    // Use payload values if provided, otherwise use appointment data
    const doctorName = payloadDoctorName || appointment.doctorName || "Dr. Unknown";
    const patientName = payloadPatientName || appointment.patientName || "Patient";

    logger.info("Creating Jitsi meeting for appointment...");
    const jitsiMeeting = createJitsiMeeting({
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      patientUserId: appointment.patientId,
      doctorName,
      patientName,
    });

    logger.info("Jitsi meeting created:", jitsiMeeting);
    const createdSession = await telemedicineRepository.createSession({
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      patientUserId: appointment.patientId,
      roomId: jitsiMeeting.roomId,
      meetingLink: jitsiMeeting.meetingLink,
      jitsiJwt: jitsiMeeting.jwt,
      status: "SCHEDULED",
      scheduledAt: appointment.scheduledAt,
    });

    logger.info("Session created successfully:", createdSession.toJSON());

    try {
      const patientEmail = payloadPatientEmail || appointment.patientEmail || undefined;
      const patientPhone = payloadPatientPhone || appointment.patientPhone || undefined;
      const doctorEmail = payloadDoctorEmail || appointment.doctorEmail || undefined;

      if (env.rabbitmqUrl) {
        await publishEvent("appointment.booked", {
          appointmentId: createdSession.appointmentId,
          meetingLink: createdSession.meetingLink,
          patientEmail,
          patientPhone,
          doctorEmail,
          source: "telemedicine-service",
        });
      } else {
        await axios.post(
          `${env.notificationServiceUrl}/notifications/appointment-booked`,
          {
            appointmentId: createdSession.appointmentId,
            meetingLink: createdSession.meetingLink,
            patientEmail,
            patientPhone,
            doctorEmail,
          }
        );
      }
      logger.info("Notification sent successfully");
    } catch (notificationError) {
      logger.warn("Failed to send notification:", notificationError.message);
    }

    return successResponse(
      "Telemedicine session created successfully",
      createdSession
    );
  } catch (error) {
    logger.error("Error in createTelemedicineSession:", error);
    throw error;
  }
};

export const getTelemedicineSessionById = async (id) => {
  const session = await telemedicineRepository.findById(id);

  if (!session) {
    const error = new Error("Session not found");
    error.statusCode = 404;
    throw error;
  }

  return successResponse("Session fetched successfully", session);
};

export const getTelemedicineSessionByAppointmentId = async (appointmentId) => {
  const session = await telemedicineRepository.findByAppointmentId(appointmentId);

  if (!session) {
    const error = new Error("Session not found for this appointment");
    error.statusCode = 404;
    throw error;
  }

  return successResponse("Session fetched successfully", session);
};

export const startTelemedicineSession = async (id) => {
  const session = await telemedicineRepository.findById(id);

  if (!session) {
    const error = new Error("Session not found");
    error.statusCode = 404;
    throw error;
  }

  if (session.status !== "SCHEDULED") {
    const error = new Error("Only scheduled sessions can be started");
    error.statusCode = 400;
    throw error;
  }

  const updatedSession = await telemedicineRepository.updateSession(id, {
    status: "ACTIVE",
    startedAt: new Date(),
  });

  return successResponse("Session started successfully", updatedSession);
};

export const endTelemedicineSession = async (id) => {
  const session = await telemedicineRepository.findById(id);

  if (!session) {
    const error = new Error("Session not found");
    error.statusCode = 404;
    throw error;
  }

  if (session.status !== "ACTIVE") {
    const error = new Error("Only active sessions can be ended");
    error.statusCode = 400;
    throw error;
  }

  const updatedSession = await telemedicineRepository.updateSession(id, {
    status: "COMPLETED",
    endedAt: new Date(),
  });

  try {
    const appointment = await getAppointmentById(updatedSession.appointmentId);
    if (env.rabbitmqUrl) {
      await publishEvent("consultation.completed", {
        appointmentId: updatedSession.appointmentId,
        patientEmail: appointment?.patientEmail || undefined,
        patientPhone: appointment?.patientPhone || undefined,
        doctorEmail: appointment?.doctorEmail || undefined,
        source: "telemedicine-service",
      });
    } else {
      await axios.post(
        `${env.notificationServiceUrl}/notifications/consultation-completed`,
        {
          appointmentId: updatedSession.appointmentId,
          patientEmail: appointment?.patientEmail || undefined,
          patientPhone: appointment?.patientPhone || undefined,
          doctorEmail: appointment?.doctorEmail || undefined,
        }
      );
    }
  } catch (notificationError) {
    logger.warn(
      "Failed to send completion notification:",
      notificationError.message
    );
  }

  return successResponse("Session ended successfully", updatedSession);
};

export const cancelTelemedicineSession = async (id) => {
  const session = await telemedicineRepository.findById(id);

  if (!session) {
    const error = new Error("Session not found");
    error.statusCode = 404;
    throw error;
  }

  if (session.status === "COMPLETED") {
    const error = new Error("Completed sessions cannot be cancelled");
    error.statusCode = 400;
    throw error;
  }

  const updatedSession = await telemedicineRepository.updateSession(id, {
    status: "CANCELLED",
  });

  return successResponse("Session cancelled successfully", updatedSession);
};

export const joinTelemedicineSession = async (id) => {
  try {
    logger.info("User joining session with id:", id);
    const session = await telemedicineRepository.findById(id);

    if (!session) {
      const error = new Error("Session not found");
      error.statusCode = 404;
      throw error;
    }

    if (session.status === "CANCELLED") {
      const error = new Error("Cancelled session cannot be joined");
      error.statusCode = 400;
      throw error;
    }

    logger.info("Session found, preparing access details");

    const meetingDetails = {
      id: session.id,
      roomId: session.roomId,
      meetingLink: session.meetingLink,
      status: session.status,
      jwt: session.jitsiJwt || null,
      appointmentId: session.appointmentId,
    };

    logger.info("Returning meeting details to user");

    return successResponse("Meeting link fetched successfully", meetingDetails);
  } catch (error) {
    logger.error("Error in joinTelemedicineSession:", error);
    throw error;
  }
};

export const listTelemedicineSessions = async () => {
  const sessions = await telemedicineRepository.getAllSessions();
  return successResponse("Sessions fetched successfully", sessions);
};