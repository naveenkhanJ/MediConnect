import Prescription from "../models/prescription.model.js";
import axios from "axios";
import PDFDocument from "pdfkit";

// create prscription
export const createPrescriptionService = async({
    appointmentId,
    doctorId,
    medications,
    notes,
}) => {

    const appointmentRes = await axios.get(`http://localhost:5001/api/appointments/${appointmentId}`);
    const appointment = appointmentRes.data;

    if(appointment.doctorId !== doctorId){
        throw new Error("Unauthorized: You are not the doctor for this appointment");
    }

    const patientId = appointment.patientId;

    return Prescription.create({
    appointmentId,
    doctorId,
    patientId,
    medications,
    notes,
    });
};

//Get all prescription
export const getAllPrescriptionService = async (doctorId) => {
    //check authorization

    if(!doctorId){
        throw new Error("Unauthorized: Doctor ID is required");
    }
    return Prescription.findAll({
        where: {doctorId},
        order: [["createdAt","DESC"]],
    });
};

//Get  prescription for a patient
export const getPatientPrescriptionsService = async (patientId,user) =>{
    
     if(user.role == "PATIENT" && user.id !== patientId){
        throw new Error("Unauthorized: You can only see your prescription");
    }
   
    return Prescription.findAll({
        where:{ patientId},
        order: [["createdAt","DESC"]]
    });
};


// generate PDF
export const generatePrescriptionPDFService = async (prescriptionId,user) =>{
    
    const prescription = await Prescription.findByPk(prescriptionId);
    if(!prescription)
        throw new Error ("Prescription not found");

    //only the doctor and the patient can generate PDF
    if(user.role === "DOCTOR" && prescription.doctorId !== user.id){
        throw new Error("Unauthorized: you can not access the prescription");

    }

    if(user.role === "PATIENT" && prescription.patientId !== user.id){
        throw new Error("Unauthorized: you can not access the prescription");
        
    }

    //get doctor info 
    // const doctorRes = await axios.get(`http://localhost:5009/api/doctors/${prescription.doctorId}`);
    // const doctor = doctorRes.data;
    const doctor = {
  id: prescription.doctorId,
  name: "Dr. John Doe",
  specialty: "General Medicine",
};

    // get patient info
    // const patientRes = await axios.get(`http://localhost:4000/patients/${prescription.patientId}`);
    // const patient = patientRes.data;
     const patient = {
        id: prescription.patientId,
        name: "Patient Name",
        age: 30,
        gender: "Not specified",
    };

    return new Promise((resolve,reject) =>{
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () =>{
        resolve(Buffer.concat(buffers));
    })

    doc.fontSize(20).text("Digital Prescription", { align: "center" });
    doc.moveDown();
     doc.fontSize(12).text(`Doctor: ${doctor.name} (${doctor.specialty || ""})`);
    doc.text(`Patient: ${patient.name}`);
    doc.text(`Appointment ID: ${prescription.appointmentId}`);
    doc.text(`Date: ${prescription.createdAt.toDateString()}`);
    doc.moveDown();

    doc.text("Medications:");
     prescription.medications.forEach((med, i) => {
    doc.text(`${i + 1}. ${med.name} - ${med.dose} - ${med.duration}`);
    });

    if (prescription.notes) {
    doc.moveDown();
    doc.text(`Notes: ${prescription.notes}`);
   }

  doc.end();
  
  });
};