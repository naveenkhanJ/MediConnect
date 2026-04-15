import Availability from "../models/availability.model.js";
import {Op} from "sequelize";

//create
export const createAvailabilty = async (data) => {
    return Availability.create(data);
};

//find by id
export const findAvailabilityById = async (id) => {
    return Availability.findByPk(id);
};

//find all by doctor
export const findAvailabilityByDoctorId = async (doctorId) => {
    return Availability.findAll({
        where:{doctorId},
        order:[["date","ASC"],["startTime","ASC"]],
    });
};

// find overlaping slot
export const findOverlappingAvailability = async (
    doctorId,
    date,
    startTime,
    endTime,
    excludedId = null
) => {
   const where = {
    doctorId,
    date,
    [Op.and]: [
      { startTime: { [Op.lt]: endTime } },
      { endTime: { [Op.gt]: startTime } }
    ]
  };

  if(excludedId){
    where.id = {[Op.ne]:excludedId};
  }
  return Availability.findOne({where});
};

//update
export const updateAvailability = async (availability) => {
    return availability.save();
};

//delete
export const deleteAvailability = async (availability) => {
    return availability.destroy();
};
