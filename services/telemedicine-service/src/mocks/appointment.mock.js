export const getMockAppointment = (appointmentId) => {
  return {
    id: String(appointmentId),
    doctorId: "D001",
    patientId: "P001",
    doctorName: "Dr. Sarah Johnson",
    patientName: "Patient Name",
    status: "CONFIRMED",
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  };
};