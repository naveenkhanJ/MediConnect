import { getDoctorProfileService, updateDoctorProfileService } from "../services/doctorProfile.service.js";


//get pwn profile
export const getDoctorProfileController = async(req ,res) =>{
    try{
        const doctorId = req.user.id;

        if(req.user.role !== "doctor"){
             return res.status(403).json({message: "Only doctors can access the profile"});
        }

        const profile = await getDoctorProfileService(doctorId);
        res.json(profile);
    }catch(err){
         res.status(500).json({message: err.message});
    }
};

//update own profile
export const updateDoctorProfileController = async(req ,res) =>{
    try{
        const doctorId = req.user.id;

        if(req.user.role !== "doctor"){
             return res.status(403).json({message: "Only doctors can update the profile"});
        }

        const updatedprofile = await updateDoctorProfileService(doctorId,req.body);
        res.json(updatedprofile);
    }catch(err){
         res.status(500).json({message: err.message});
    }
};
