import express from "express";
import { createProfileController, getProfileController, updateProfileController,getDoctorsBySpecialityController } from "../controllers/doctorProfile.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/register",upload.single("image"),createProfileController)
router.get("/me",fakeAuth,requireVerifiedDoctor,getProfileController);
router.put("/me",fakeAuth,requireVerifiedDoctor,updateProfileController);
router.get("/search", requireVerifiedDoctor,getDoctorsBySpecialityController);

export default router;