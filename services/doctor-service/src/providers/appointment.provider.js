import axios from "axios";

const BASE_URL = process.env.APPOINTMENT_SERVICE_URL;

export const AppointmentProvider = {

    //get appointment by ID
    getAppointmentById: async (appointmentId) => {
    const res = await axios.get(
       `${BASE_URL}/${appointmentId}`
    );
    return res.data;
    },

    //SEND DECISION 
    updateAppointmentDecision: async (appointmentId, status) =>{
        const res = await axios.patch(
        `${BASE_URL}/${appointmentId}/decision`,
        {status}
    );
    return res.data;

    },
    getPendingAppointments: async (doctorId) => {
         const res = await axios.get(
        `${BASE_URL}/doctor/${doctorId}/pending`,
    );
    return res.data;

    },
     getDoctorAppointments: async (doctorId) => {
    const res = await axios.get(
      `${BASE_URL}/doctor/${doctorId}`
    );
    return res.data;
  }
    
};