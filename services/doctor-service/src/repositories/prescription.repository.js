import Prescription from "../models/prescription.model.js"


export const PrescriptionRepository ={

    create: async(data) =>{
        return await Prescription.create(data);
    },
     
    findByDoctorId: async (doctorId) => {
         return await Prescription.findAll({
        where:{ doctorId},
        order: [["createdAt","DESC"]]
    });
},
     findByPatientId: async (patientId) => {
         return await Prescription.findAll({
        where:{ patientId},
        order: [["createdAt","DESC"]]
    });
},
findById: async (id) =>{
    return await Prescription.findByPk(id);
 }
};