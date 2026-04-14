import axios from "axios";
import { getAppointmentByIdRepo, getPendingAppointmentRepo, updateAppointmentDecisionRepo } from "../repositories/appointmentStatus.repository.js";


const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL;

//get pending appointmenets for doctors

export const handleAppointmentDesicionService = async ({
    appointmentId,
    doctorId,
    status
}) => {

    const appointment = await getAppointmentByIdRepo(appointmentId);
    
    if(!appointment) {
        throw new Error("Appointment not found");
    }

    //ensure doctor owns appointment
    if(appointment.dactorId !== doctorId){
        throw new Error("You are not allowed to modfy this appointment");
    }

    // only allow if the status is pending
    if(appointment.status !== "PENDING"){
        throw new Error("only pending appointments can be approved/rejected");

    }

    if(!["Approve", "Reject"].includes(status)){
        throw new Error("Invalid status");
    }

    return await updateAppointmentDecisionRepo(appointmentId,status);

};

export const getPendingAppointmentService = async(doctorId) => {
    return await getPendingAppointmentRepo(doctorId);

}
 
//fetch all appointmnets for a doctor
// export const getDoctorAppointments = async (doctorId) =>{
//     const res = await axios.get(`${APPOINTMENT_SERVICE_URL}/doctor/${doctorId}`);
     
//     return res.data;
// };