import express from "express";
import { createProfileController, getProfileController, updateProfileController,getDoctorsBySpecialityController } from "../controllers/doctorProfile.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";

const router = express.Router();

router.post("/",fakeAuth,createProfileController)
router.get("/me",fakeAuth,getProfileController);
router.put("/me",fakeAuth,updateProfileController);
router.get("/search", fakeAuth,getDoctorsBySpecialityController);

export default router;