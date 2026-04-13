import { addAvailabilityService, deleteAvailabilityService, getDoctorAvailabilityService, updateAvailabilityService } from "../services/availability.service.js"



//get all slots
export const getAvailabilityController = async (req, res) => {
    try{
        const slots = await getDoctorAvailabilityService( req.user.id);
        res.json(slots);
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

//Add a slot
export const addAvailabilityController = async (req, res) => {
    try{
        const slot = await addAvailabilityService({
            doctorId: req.user.id,
            ...req.body
        });
        res.status(201).json(slot);
    }catch(err){
        res.status(400).json({message:err.message});
    }
};

//update a slot
export const updateAvailabilityController = async (req, res) => {

    try{
        const slot = await updateAvailabilityService(req.params.id, req.body);
        res.json(slot);
    }catch(err){
        res.status(400).json({message:err.message});
    }
};

//Delete a slot
export const deleteAvailabilityController = async (req, res) => {
    try{
        await deleteAvailabilityService(req.params.id);
        res.json({message: "Slot deleted"});
    }catch(err){
        res.status(400).json({message:err.message});
    }
};
