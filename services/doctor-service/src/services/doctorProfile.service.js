import { doctorProfileRepository } from "../repositories/doctorProfile.repository.js";

//create profile
export const createProfileService = async( data) =>{
    const existing = await doctorProfileRepository.findByEmail(data.email);

    if (existing)
        throw new Error ("Profile already exists");

    return await doctorProfileRepository.create({
    ...data,
    isVerified: false
    });
};



// get doctor profile
export const getProfileService = async(doctorId) => {
   const profile = await doctorProfileRepository.findByDoctorId(doctorId);

   if (!profile)
        throw new Error ("Profile not found");

    return profile;
 };


// update doctor profile(partilay re-verification logic)
export const updateProfileService = async(doctorId,data) => {
    const profile = await doctorProfileRepository.findByDoctorId(doctorId);

     if (!profile)
        throw new Error ("Profile not found");

      //remove immutable field
      delete data.speciality;
      delete data.licenseNumber;
      delete data.email; 
      delete data.password; 

    return await doctorProfileRepository.updateDoctorById(doctorId,data);

};

//get doctors by speciality
 export const getDoctorsBySpecialityService = async (speciality) => {
    if (!speciality) {
        throw new Error("Speciality is required");
    }

    const doctors = await doctorProfileRepository.findBySpeciality(speciality);

    if (!doctors || doctors.length === 0) {
        throw new Error("No doctors found for this speciality");
    }

    return doctors;
};