import { createProfileService, getProfileService, updateProfileService,getDoctorsBySpecialityService} from "../services/doctorProfile.service.js";

//create profile
export const createProfileController = async(req,res) =>{
    try{

        const profile = await createProfileService(req.body);

        res.status(201).json(profile);

    }catch(err){
        res.status(400).json({message: err.message});
    }
};
//get pwn profile
export const getProfileController = async(req ,res) =>{
    try{
        const doctorId = req.user.id;

        const profile = await getProfileService(doctorId);

        if(req.user.role !== "doctor"){
             return res.status(403).json({message: "Only doctors can access the profile"});
        }
        res.status(200).json(profile);
    }catch(err){
         res.status(500).json({message: err.message});
    }
};

//update own profile
export const updateProfileController = async(req ,res) =>{
    try{
        const doctorId = req.user.id;

        const updated = await updateProfileService(doctorId, req.body);

        res.status(200).json(updated);
    }catch(err){
         res.status(400).json({message: err.message});
    }
};

//get doctors by speciality

export const getDoctorsBySpecialityController = async (req, res) => {
    try {
        const { speciality } = req.query;

        const doctors = await getDoctorsBySpecialityService(speciality);

        res.status(200).json(doctors);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};