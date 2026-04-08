import { startTelemedicineSessionService } from "../services/Doctortelemedicine.service.js";


export const startTelemedicineController = async(req ,res) =>{
    try{
        const appointmentId = req.params.appointmentId;

        if(req.user.role !== "doctor"){
             return res.status(403).json({message: "Only doctors can start the session"});
        }

        const meetingLink = await startTelemedicineSessionService(appointmentId);
        res.status(200).json({meetingLink});
    }catch(err){
         res.status(500).json({message: err.message});
    }
};