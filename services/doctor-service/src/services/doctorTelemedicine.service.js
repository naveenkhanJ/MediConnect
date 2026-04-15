import axios from "axios";

const TELEMEDICINE_SERVICE_URL = "https://localhost:5007/api/telemedicine";
export const startTelemedicineSessionService = async(appointmentId) => {

    //call telemedicine service
   // const res = await axios.post(`${TELEMEDICINE_SERVICE_URL}/start/${appointmentId}`);
   const meetingLink = `https://meet.jit.si/appointment-${appointmentId}`;
   // return res.data.meetingLink;
   return meetingLink;
 };