import { Op } from "sequelize";
import Appointment from "../models/appointment.model.js";

export const createAppointment = async (data) => {
  return Appointment.create(data);
};

export const findAppointmentById = async (id) => {
  return Appointment.findByPk(id);
};

export const findAppointmentByDoctorDateSlot = async (
  doctorId,
  appointmentDate,
  timeSlot,
  excludeId = null
) => {
  const where = {
    doctorId,
    appointmentDate,
    timeSlot
  };

  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }

  return Appointment.findOne({ where });
};

export const updateAppointment = async (appointment) => {
  return appointment.save();
};

export const findAppointmentsByPatientId = async (patientId) => {
  return Appointment.findAll({
    where: { patientId },
    order: [["createdAt", "DESC"]]
  });
};