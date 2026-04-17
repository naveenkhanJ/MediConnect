import { createPrescriptionService, generatePrescriptionPDFService, getDoctorPrescriptionsService, getPatientPrescriptionsService } from "../services/prescription.service.js";
import { AppointmentProvider } from "../providers/appointment.provider.js";
import { PrescriptionRepository } from "../repositories/prescription.repository.js";


//doctor create prescription
export const createPrescriptionController = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { appointmentId, medications, notes } = req.body;

        // 1. Validate input
        if (!appointmentId || !medications) {
            return res.status(400).json({
                message: "appointmentId and medications are required"
            });
        }

        ///get appointment
        const appointment = await AppointmentProvider.getAppointmentById(appointmentId);
       
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }//

        // ensure doctor owns appointment
        if (appointment.doctorId !== doctorId) {
            return res.status(403).json({
                message: "You are not allowed to create prescription for this appointment"
            });
        }

        // CHECK DUPLICATE PRESCRIPTION (IMPORTANT)
       const existing = await PrescriptionRepository.findOneByAppointmentId(appointmentId);

        if (existing) {
            return res.status(409).json({
                message: "Prescription already exists for this appointment"
            });
        }

        // Create prescription
        const prescription = await createPrescriptionService({
            appointmentId,
            doctorId,
            medications,
            notes
        });

        return res.status(201).json(prescription);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

//get doctors prescription by id
export const  getAllPrescriptionsController = async (req,res) =>{
    try{
        if(req.user.role !== "doctor"){
             return res.status(403).json({message: "Only doctors can access the presriptions"});
        }

        const doctorId = req.user.id;
        const prescriptions = await getDoctorPrescriptionsService(doctorId);
        res.json(prescriptions);
    }catch(err){
        res.status(403).json({message: err.message});
    }

};

//get prescription for patient
export const getPatientPrescriptionController = async (req,res) => {
    try{
        const prescriptions = await getPatientPrescriptionsService(
            req.params.patientId,
            req.user
        );
         res.json(prescriptions);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// download pdf
export const downloadPrescriptionPDFController = async(req,res) => {
    try{
        const pdfBuffer = await generatePrescriptionPDFService(
            req.params.id,
            req.user
        );

       res.setHeader("Content-Type", "application/pdf");
       res.setHeader("Content-Disposition", `inline; filename=prescription-${req.params.id}.pdf`);
       res.setHeader("Content-Length", pdfBuffer.length);
         res.end(pdfBuffer);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}