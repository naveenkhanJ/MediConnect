import Availability from "../models/availability.model.js";
import { Op } from "sequelize";
import { createAvailabilty, deleteAvailability, findAvailabilityByDoctorId, findAvailabilityById, findOverlappingAvailability, updateAvailability } from "../repositories/availability.repository.js";

// Get all avilability slots by doctor id

export const getDoctorAvailabilityService = async (doctorId) => {
    return findAvailabilityByDoctorId(doctorId);
};

// Add ne slot

export const addAvailabilityService = async ({ doctorId, date, startTime, endTime}) => {

    if (startTime >= endTime){
        throw new Error("Start time must be before end time");
    }

    // overlap detection

    const existing = await findOverlappingAvailability(

            doctorId,
            date,
            startTime,
            endTime
    );

    if(existing){
        throw new Error("Time slot overlap exisiting availability time slot");
    }

    return createAvailabilty({ doctorId, date, startTime, endTime});
};

//update a slot
export const updateAvailabilityService = async (id, { date, startTime, endTime}) => {

    const slot = await findAvailabilityById(id);
    if(!slot){
        throw new Error("Availability slot not found");
    }
     if (startTime >= endTime){
        throw new Error("Start time must be before end time");
    }

    // overlap check
    const existing = await findOverlappingAvailability(

            doctorId,
            date,
            startTime,
            endTime
    );

    if(existing){
        throw new Error("Time slot overlap exisiting availability time slot");
    }

    // update values
    slot.date = date;
    slot.startTime = startTime;
    slot.endTime= endTime;

    return updateAvailability(slot);
};


// delete a slot
export const deleteAvailabilityService = async (id) => {
    const slot = await findAvailabilityById(id);
    if(!slot){
         throw new Error("Availability slot not found");
    }
    return deleteAvailability(slot);
};