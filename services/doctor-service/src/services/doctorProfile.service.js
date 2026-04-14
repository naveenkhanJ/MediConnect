import { doctorProfileRepository } from "../repositories/doctorProfile.repository.js";

//create profile
export const createProfileService = async(doctorId, data) =>{
    const existing = await doctorProfileRepository.findByDoctorId(doctorId);

    if (existing)
        throw new Error ("Profile already exists");

    return await doctorProfileRepository.create({
    doctorId,
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
      

    return await doctorProfileRepository.updateDoctorById(doctorId,data);

};