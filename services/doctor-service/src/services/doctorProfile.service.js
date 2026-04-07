import axios from "axios";

const DOCTOR_SERVICE_URL = "https://localhost:5008/api/doctors";

// get doctor profile
// export const getDoctorProfileService = async(doctorId) => {
//     const res = await axios.get(`${DOCTOR_SERVICE_URL}/${doctorId}`);
//     return res.data;
// };
export const getDoctorProfileService = async (doctorId) => {
    //  Mock data instead of axios
    return {
        id: doctorId,
        name: "Dr. John Doe",
        specialty: "Cardiology",
        experience: "5 years",
        email: "doctor@gmail.com"
    };
};

// update doctor profile
export const updateDoctorProfileService = async(doctorId,data) => {
  //  const res = await axios.put(`${DOCTOR_SERVICE_URL}/${doctorId}`,data);
   // return res.data;
   return {
        id: doctorId,
        ...data,   // merge updated fields
        message: "Profile updated successfully"
    };
};