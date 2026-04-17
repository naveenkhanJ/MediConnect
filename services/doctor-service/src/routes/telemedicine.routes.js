import express from "express";
import { createSessionController, endSessionController, getSessionByAppointmentController, joinSessionController, startSessionController } from "../controllers/telemedicine.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";


const router = express.Router();

router.post("/", requireVerifiedDoctor, createSessionController);
router.post("/:id/join", requireVerifiedDoctor, joinSessionController);
router.patch("/:id/start", requireVerifiedDoctor, startSessionController);
router.patch("/:id/end", requireVerifiedDoctor, endSessionController);
router.get("/appointment/:appointmentId", requireVerifiedDoctor, getSessionByAppointmentController);

export default router;