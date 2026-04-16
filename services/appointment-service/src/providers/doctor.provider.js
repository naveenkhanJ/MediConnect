import axios from "axios";

const DOCTOR_SERVICE = process.env.DOCTOR_SERVICE_URL || "http://localhost:5009";

export const searchDoctorsBySpecialty = async (specialty) => {
  const response = await axios.get(`${DOCTOR_SERVICE}/api/doctors`, {
    params: { speciality: specialty }
  });
  return response.data;
};

export const getDoctorById = async (doctorId) => {
  const response = await axios.get(`${DOCTOR_SERVICE}/api/doctors/${doctorId}`);
  const doc = response.data;
  if (!doc) return null;

  // Normalise field names used by appointment.service.js
  return {
    ...doc,
    name: doc.fullName,
    specialty: doc.speciality,
    consultationFee: doc.fees
  };
};
