import { getPatientReport } from "../services/report.service.js";
import { getDoctorAppointments } from "../services/appointmentStatus.service.js";

//get reports
export const fetchPatientReport = async (req,res) => {
    try{
        const doctorId = req.user.id;
        const {patientId} = req.params;


        const appointmenets = await getDoctorAppointments(doctorId);
        
        const patientAppointment = appointmenets.find(
           ( appt) => String(appt.patientId) == String(patientId)
        );
       

        if(!patientAppointment){
            return  res.status(403).json({message: "You have no access to this patien's report"});
        }
         

        const reports = await getPatientReport(patientId);
         res.status(200).json(reports);
    }catch (err){
         res.status(500).json({message: err.message});
    }
};