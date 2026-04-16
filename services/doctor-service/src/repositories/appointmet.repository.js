
import { AppointmentProvider } from "../providers/appointment.provider.js";

export const getAppointmentByIdRepo = async (id) => {
  return await AppointmentProvider.getAppointmentById(id);
};