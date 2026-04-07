import express from "express";
import { getDoctorProfileController, updateDoctorProfileController } from "../controllers/doctorProfile.controller.js";


const router = express.Router();

router.get("/me",getDoctorProfileController);
router.put("/me",updateDoctorProfileController);

export default router;