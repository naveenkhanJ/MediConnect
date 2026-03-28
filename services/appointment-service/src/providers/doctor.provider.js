import { mockDoctors } from "../mocks/doctors.js";

export const searchDoctorsBySpecialty = async (specialty) => {
  return mockDoctors.filter(
    (doctor) => doctor.specialty.toLowerCase() === specialty.toLowerCase()
  );
};

export const getDoctorById = async (doctorId) => {
  return mockDoctors.find((doctor) => doctor.id === doctorId);
};