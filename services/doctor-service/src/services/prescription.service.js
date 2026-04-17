
import PDFDocument from "pdfkit";
import { PrescriptionRepository } from "../repositories/prescription.repository.js";
import { getAppointmentByIdRepo } from "../repositories/appointmentStatus.repository.js";

// create prscription
export const createPrescriptionService = async({
    appointmentId,
    doctorId,
    medications,
    notes,
}) => {

    const appointment = await getAppointmentByIdRepo(appointmentId);
   

    if(appointment.doctorId !== doctorId){
        throw new Error("Unauthorized: You are not the doctor for this appointment");
    }

    const patientId = appointment.patientId;

    return await  PrescriptionRepository.create({
    appointmentId,
    doctorId,
    patientId,
    medications,
    notes,
    });
};

//doctor prescription
export const getDoctorPrescriptionsService = async (doctorId) => {
    //check authorization

    if(!doctorId){
        throw new Error("Unauthorized: Doctor ID is required");
    }
    return await PrescriptionRepository.findByDoctorId(doctorId);
};

//Get  prescription for a patient
export const getPatientPrescriptionsService = async (patientId,user) =>{
    
     if(user.role == "PATIENT" && user.id !== patientId){
        throw new Error("Unauthorized: You can only see your prescription");
    }
   
    return await PrescriptionRepository.findByPatientId(patientId);
};

//get by id
export const getPrescriptionByIdService = async(id) => {
    const prescription = await PrescriptionRepository.findById(id);
    
    if (!prescription) throw new Error("Not found");
    return prescription;
}

// generate PDF
export const generatePrescriptionPDFService = async (id, user) => {

    const prescription = await PrescriptionRepository.findById(id);

    if (!prescription) throw new Error("Not found");

    if (
        user.role === "DOCTOR" &&
        prescription.doctorId !== user.id
    ) {
        throw new Error("Unauthorized");
    }

    if (
        user.role === "PATIENT" &&
        prescription.patientId !== user.id
    ) {
        throw new Error("Unauthorized");
    }

    // mock doctor/patient (replace with provider later)
    const doctor = {
        name: "Dr. John Doe",
        specialty: "General Medicine"
    };

    const patient = {
        name: "Patient Name"
    };

    return new Promise((resolve) => {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        doc.fontSize(20).text("Prescription", { align: "center" });
        doc.moveDown();

        doc.text(`Doctor: ${doctor.name}`);
        doc.text(`Patient: ${patient.name}`);
        doc.text(`Appointment: ${prescription.appointmentId}`);

        doc.moveDown();
        doc.text("Medications:");

        prescription.medications.forEach((m, i) => {
            doc.text(`${i + 1}. ${m.name} - ${m.dose}`);
        });

        if (prescription.notes) {
            doc.moveDown();
            doc.text(`Notes: ${prescription.notes}`);
        }

        doc.end();
    });
};