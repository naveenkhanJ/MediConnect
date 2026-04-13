import { approveAppointment, getPendingAppointmentsService, handleAppointmentDesicionService, rejectAppointment } from "../services/appointmentStatus.service.js";

//fetch pending appointmets for logged doctor
export const getPendingAppointmentsController = async (req,res) => {
    try{
        const doctorId = req.user.id;
        const appointmenets = await getPendingAppointmentsService(doctorId);
        res.status(200).json(appointmenets);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

//approve/reject appointments
export const decideAppointmentController = async (req,res) => {
    try{
        const doctorId = req.user.id;
        const {appointmentId} = req.params;
        const{status} = req.body;

        const result = await handleAppointmentDesicionService({
            appointmentId,
            doctorId,
            status
        });

        res.status(200).json({
            message: `Appointment ${status.toLowerCase()} successfully`,
             appointment: result});
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

