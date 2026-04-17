import express from "express";
import { addAvailabilityController, deleteAvailabilityController, getAvailabilityController, updateAvailabilityController } from "../controllers/availability.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";
const router = express.Router();


// important add this middleware for this doctors actions requireVerifiedDoctor
router.get("/",fakeAuth,requireVerifiedDoctor,getAvailabilityController);
router.post("/",fakeAuth,requireVerifiedDoctor,addAvailabilityController);
router.put("/:id",fakeAuth,requireVerifiedDoctor, updateAvailabilityController);
router.delete("/:id",fakeAuth,requireVerifiedDoctor,deleteAvailabilityController);

export default router;