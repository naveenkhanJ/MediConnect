import { AppointmentProvider } from "../providers/appointment.provider.js";

export const getDashboardSummary = async (doctorId) => {
  // get all doctor appointments
  const appointments = await AppointmentProvider.getDoctorAppointments(doctorId);

  // filter today's appointments
  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (a) => a.date?.startsWith(today)
  );

  // count pending
  const pendingAppointments = appointments.filter(
    (a) => a.status === "Pending"
  );

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