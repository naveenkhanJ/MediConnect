import { approveAppointment, getPendingAppointments, rejectAppointment } from "../services/appointmentStatus.service.js";

//fetch pending appointmets for logged doctor
export const fetchPendingAppointments = async (req,res) => {
    try{
        const doctorId = req.user.id;
        const appointmenets = await getPendingAppointments(doctorId);
        res.json(appointmenets);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

//approve/reject appointments
export const decideAppointment = async (req,res) => {
    try{
        const doctorId = req.user.id;
        const {appointmentId,status} = req.body;

        if (!["Approve", "Reject"].includes(status)){
            return res.status(400).json({message:"Status must be Approve or Reject"});
        }

        // call service
        const updated = status === "Approve"
        ? await approveAppointment(appointmentId)
        : await rejectAppointment(appointmentId);

        res.json({message: `Appointment ${status.toLowerCase()} successfully`, appointment: updated});
    }catch(err){
        res.status(500),json({message: err.message});
    }
};