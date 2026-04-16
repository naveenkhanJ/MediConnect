
import { AppointmentProvider } from "../providers/appointment.provider.js";

const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL;


export const getAppointmentByIdRepo = async (id) => {
    return await AppointmentProvider.getAppointmentById(id);
};

export const updateAppointmentDecisionRepo = async(id, doctorId, status) =>{
    return await AppointmentProvider.updateAppointmentDecision(id, doctorId, status);
};

export const getPendingAppointmentRepo = async(doctorId) => {
    return await AppointmentProvider.getPendingAppointments(doctorId);
}

