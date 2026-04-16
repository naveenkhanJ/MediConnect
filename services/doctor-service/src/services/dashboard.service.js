import { AppointmentProvider } from "../providers/appointment.provider.js";

export const getDashboardSummary = async (doctorId) => {
  // /today already returns only today's appointments
  const todayAppointments = await AppointmentProvider.getDoctorAppointments(doctorId);

  // /pending returns CONFIRMED appointments awaiting doctor action
  const pendingAppointments = await AppointmentProvider.getPendingAppointments(doctorId);

  //  unique patients today
  const uniquePatients = new Set(
    todayAppointments.map((a) => a.patientId)
  );

  return {
    patientsToday: uniquePatients.size,
    appointmentsToday: todayAppointments.length,
    pendingAppointments: pendingAppointments.length,
  };
};