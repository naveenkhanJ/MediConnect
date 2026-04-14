import axios from "axios";

const BASE_URL = process.env.TELEMEDICINE_SERVICE_URL;

//create session
export const createSession = async(data) =>{
    const res= await axios.post(`${BASE_URL}`,data);
    return res.data;
};

//get session by id
export const getSessionId = async(id) =>{
    const res= await axios.post(`${BASE_URL}/${id}`);
    return res.data;
};

//get session by appointment
export const getSessionByAppointmentId = async(appointmentId) =>{
    const res= await axios.get(`${BASE_URL}/appointment/${appointmentId}`);
    return res.data;
};

//start session
export const startSession = async(id) =>{
    const res= await axios.patch(`${BASE_URL}/${id}/start`);
    return res.data;
};

// end session
export const endSession = async (id) => {
  const res = await axios.patch(`${BASE_URL}/${id}/end`);
  return res.data;
};
//Join session
export const joinSession = async (id) => {
  const res = await axios.post(`${BASE_URL}/${id}/join`);
  return res.data;
};


