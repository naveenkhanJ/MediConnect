import axios from "axios";

const APPOINTMENT_SERVICE_URL = "http://localhost:5001/api/appointments";

//get pending appointmenets for doctors

export const getPendingAppointments = async(doctorId) => {
    const res = await axios.get(`${APPOINTMENT_SERVICE_URL}/doctor/${doctorId}/pending`);
    return res.data.map(appointment => ({
        ...appointment,
        paymentStaus: appointment.paymentStaus
    }));
};

//Approve appointment

export const approveAppointment = async (appointmnetId) =>{
    const res = await axios.patch(`${APPOINTMENT_SERVICE_URL}/${appointmnetId}/status`,{
        status: "Approve",
    });
    return res.data;
};

// Reject appointment
export const rejectAppointment = async (appointmnetId) =>{
    const res = await axios.patch(`${APPOINTMENT_SERVICE_URL}/${appointmnetId}/status`,{
        status: "Reject",
    });
    return res.data;
};