
import { getAppointmentByIdRepo } from "../repositories/appointmet.repository.js";
import { getPatientReportsRepo } from "../repositories/report.repository.js";

export const getPatientReportsService = async ({
  appointmentId,
  doctorId
}) => {

  // 1. Get appointment
  const appointment = await getAppointmentByIdRepo(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // 2. Security check (VERY IMPORTANT)
  if (appointment.doctorId !== doctorId) {
    throw new Error("Unauthorized access");
  }

  // 3. Get patientId from appointment
  const patientId = appointment.patientId;

  // 4. Fetch reports
  return await getPatientReportsRepo(patientId);
};