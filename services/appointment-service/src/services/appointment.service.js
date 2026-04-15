import axios from "axios";
import {
  createAppointment,
  findAppointmentByDoctorDateSlot,
  findAppointmentById,
  updateAppointment,
  findAppointmentsByPatientId
} from "../repositories/appointment.repository.js";

import {
  getDoctorById,
  searchDoctorsBySpecialty
} from "../providers/doctor.provider.js";

export const searchDoctorsService = async (specialty) => {
  if (!specialty) {
    throw new Error("Specialty is required");
  }

  return searchDoctorsBySpecialty(specialty);
};

export const createAppointmentService = async ({
  patientId,
  doctorId,
  appointmentDate,
  timeSlot,
  consultationType
}) => {
  const doctor = await getDoctorById(doctorId);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const existing = await findAppointmentByDoctorDateSlot(
    doctorId,
    appointmentDate,
    timeSlot
  );

  if (existing && ["PENDING_PAYMENT", "CONFIRMED", "RESCHEDULED"].includes(existing.status)) {
    throw new Error("This slot is already booked");
  }

  const appointment = await createAppointment({
    patientId,
    doctorId,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    appointmentDate,
    timeSlot,
    consultationType,
    status: "PENDING_PAYMENT"
  });

  const paymentResponse = await axios.post(
    `${process.env.PAYMENT_SERVICE_URL}/api/payments/create`,
    {
      appointmentId: appointment.id,
      patientId,
      amount: doctor.consultationFee,
      currency: "LKR",
      gateway: "PAYHERE"
    }
  );

  appointment.paymentId = paymentResponse.data.payment.id;
  await updateAppointment(appointment);

  return {
    appointment,
    payment: paymentResponse.data.payment
  };
};

export const rescheduleAppointmentService = async ({
  appointmentId,
  appointmentDate,
  timeSlot
}) => {
  const appointment = await findAppointmentById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.status === "CANCELLED") {
    throw new Error("Cancelled appointment cannot be rescheduled");
  }

  const existing = await findAppointmentByDoctorDateSlot(
    appointment.doctorId,
    appointmentDate,
    timeSlot,
    appointment.id
  );

  if (existing && ["PENDING_PAYMENT", "CONFIRMED", "RESCHEDULED"].includes(existing.status)) {
    throw new Error("New slot is already booked");
  }

  appointment.appointmentDate = appointmentDate;
  appointment.timeSlot = timeSlot;
  appointment.status = "RESCHEDULED";

  await updateAppointment(appointment);
  return appointment;
};

export const cancelAppointmentService = async (appointmentId) => {
  const appointment = await findAppointmentById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.status === "COMPLETED") {
    throw new Error("Completed appointment cannot be cancelled");
  }

  appointment.status = "CANCELLED";
  await updateAppointment(appointment);
  return appointment;
};

export const getAppointmentStatusService = async (appointmentId) => {
  const appointment = await findAppointmentById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return {
    appointmentId: appointment.id,
    status: appointment.status,
    meetingLink: appointment.meetingLink
  };
};

export const getMyAppointmentsService = async (patientId) => {
  return findAppointmentsByPatientId(patientId);
};

export const confirmPaymentService = async ({ appointmentId, paymentId }) => {
  const appointment = await findAppointmentById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  appointment.status = "CONFIRMED";
  appointment.paymentId = paymentId;

  
  await updateAppointment(appointment);
  return appointment;
};