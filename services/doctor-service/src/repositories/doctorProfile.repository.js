import Doctor from "../models/doctorProfile.model.js"

export const doctorProfileRepository = {

  create: async (data) => {
    return await Doctor.create(data);
  },

  findByDoctorId: async (id) => {
    return await Doctor.findOne({ where: { id } });
  },

  findAll: async () => {
    return await Doctor.findAll({ order: [["fullName", "ASC"]] });
  },

  findBySpeciality: async (speciality) => {
    return await Doctor.findAll({
      where: { speciality },
      order: [["fullName", "ASC"]]
    });
  },
  
  findByEmail: async (email) => {
  return await Doctor.findOne({ where: { email } });
  },

  updateDoctorById: async (id, data) => {
    await Doctor.update(data, {
      where: { id }
    });

    return await Doctor.findOne({ where: { id } });
  }
};