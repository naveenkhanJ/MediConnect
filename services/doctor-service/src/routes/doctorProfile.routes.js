import express from "express";
import { createProfileController, getProfileController, updateProfileController,getDoctorsBySpecialityController } from "../controllers/doctorProfile.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";

const router = express.Router();

router.post("/",createProfileController)
router.get("/me",fakeAuth,requireVerifiedDoctor,getProfileController);
router.put("/me",fakeAuth,requireVerifiedDoctor,updateProfileController);
router.get("/search", fakeAuth,requireVerifiedDoctor,getDoctorsBySpecialityController);

export default router;