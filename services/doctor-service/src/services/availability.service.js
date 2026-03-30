import Availability from "../models/availability.model.js";
import { Op } from "sequelize";

// Get all avilability slots by doctor id

export const getDoctorAvailabilityService = async (doctorId) => {
    return Availability.findAll({
        where: { doctorId },
        order: [["date", "ASC"], ["startTime", "ASC"]],
    });
};

// Add ne slot

export const addAvailabilityService = async ({ doctorId, date, startTime, endTime}) => {

    if (startTime >= endTime){
        throw new Error("Start time must be before end time");
    }

    // overlap detection

    const existing = await Availability.findOne({
        where: {
            doctorId,
            date,
            [Op.and] : [
                { startTime: {[Op.lt]: endTime}},
                { endTime: {[Op.gt]: startTime}}
            ]
        }
    });

    if(existing){
        throw new Error("Time slot overlap exisiting availability time slot");
    }

    return Availability.create({ doctorId, date, startTime, endTime});
};

//update a slot
export const updateAvailabilityService = async (id, { date, startTime, endTime}) => {

    const slot = await Availability.findByPk(id);
    if(!slot){
        throw new Error("Availability slot not found");
    }
     if (startTime >= endTime){
        throw new Error("Start time must be before end time");
    }

    // overlap check
    const existing = await Availability.findOne({
        where: {
            doctorId: slot.doctorId,
            date,
            id:{[Op.ne]: id },
            [Op.and] : [
                { startTime: {[Op.lt]: endTime}},
                { endTime: {[Op.gt]: startTime}}
            ]
        }
    });

    if(existing){
        throw new Error("Time slot overlap exisiting availability time slot");
    }

    // update values
    slot.date = date;
    slot.startTime = startTime;
    slot.endTime= endTime;

    return slot.save();
};


// delete a slot
export const deleteAvailabilityService = async (id) => {
    const slot = await Availability.findByPk(id);
    if(!slot){
         throw new Error("Availability slot not found");
    }
    return slot.destroy();
};