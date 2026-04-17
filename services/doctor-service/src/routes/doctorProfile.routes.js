import express from "express";
import { createProfileController, getProfileController, updateProfileController,getDoctorsBySpecialityController } from "../controllers/doctorProfile.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", upload.single("image"), createProfileController);

// Protected routes
router.get("/me", authMiddleware, requireVerifiedDoctor, getProfileController);
router.put("/me", authMiddleware, requireVerifiedDoctor, updateProfileController);
router.get("/search", getDoctorsBySpecialityController);

export default router;