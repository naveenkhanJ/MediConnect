import axios from "axios";
import env from "../config/env.js";
import { getMockAppointment } from "../mocks/appointment.mock.js";
import { getLogger } from "../utils/logger.util.js";

const logger = getLogger("appointment.provider");

export const getAppointmentById = async (appointmentId) => {
  try {
    if (env.useMockAppointment) {
      logger.info("Using mock appointment data for appointmentId:", appointmentId);
      return getMockAppointment(appointmentId);
    }

    logger.info("Fetching appointment from service:", `${env.appointmentServiceUrl}/appointments/${appointmentId}`);
    const response = await axios.get(
      `${env.appointmentServiceUrl}/appointments/${appointmentId}`
    );

    logger.info("Appointment fetched successfully:", response.data);
    return response.data.data;
  } catch (error) {
    logger.error("Error fetching appointment:", error.message);

    // If appointment service is down, provide helpful error
    if (error.code === "ECONNREFUSED") {
      const helpError = new Error(
        `Cannot connect to appointment service at ${env.appointmentServiceUrl}. ` +
        `Please start the appointment service or set USE_MOCK_APPOINTMENT=true in .env`
      );
      helpError.statusCode = 503;
      throw helpError;
    }

    throw error;
  }
};