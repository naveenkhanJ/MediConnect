import { createPrescriptionService, generatePrescriptionPDFService, getAllPrescriptionService, getPatientPrescriptionsService } from "../services/prescription.service.js";

//doctor create prescription
export const createPrescriptionController = async (req ,res) =>{

    try{
        const doctorId = req.user.id;
        const {appointmentId, patientId,medications , notes } = req.body;

        const prescription = await createPrescriptionService({
            appointmentId,
            doctorId,
            patientId,
            medications,
            notes,
        });
           res.status(201).json(prescription);
    }catch(err){
        res.status(500).json({message: err.message});
    }
    
};

//get doctors prescription by id
export const  getAllPrescriptionsController = async (req,res) =>{
    try{
        if(req.user.role !== "doctor"){
             return res.status(403).json({message: "Only doctors can access the presriptions"});
        }

        const doctorId = req.user.id;
        const prescriptions = await getAllPrescriptionService(doctorId);
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
        res.status(403).json({message: err.message});
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
        res.status(403).json({message: err.message});
    }
}