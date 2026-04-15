import * as provider from "../providers/telemedicine.provider.js";

// create session
export const createSessionService = async (data) => {
  return await provider.createSession(data);
};

// join session
export const joinSessionService = async (id) => {
  return await provider.joinSession(id);
};

// start session
export const startSessionService = async (id) => {
  return await provider.startSession(id);
};

// end session
export const endSessionService = async (id) => {
  return await provider.endSession(id);
};

// get by appointment
export const getSessionByAppointmentService = async (appointmentId) => {
  return await provider.getSessionByAppointmentId(appointmentId);
};