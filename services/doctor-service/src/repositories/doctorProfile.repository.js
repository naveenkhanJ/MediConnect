import Doctor from "../models/doctorProfile.model.js"

export const doctorProfileRepository = {

    create: async (data) => {
        return await Doctor.create(data);
    },

    findByDoctorId : async (doctorId) => {
        return await Doctor.findOne({where:{doctorId}});
    },

    updateDoctorById:async(doctorId, data) => {
        await Doctor.update(data, {
            where: {doctorId}
        });
        return await Doctor.findOne({where:{doctorId}});
    }
};