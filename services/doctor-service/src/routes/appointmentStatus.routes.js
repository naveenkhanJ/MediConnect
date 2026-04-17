import express from "express";
import { decideAppointmentController, getPendingAppointmentsController, getTodayAppointmentsController } from "../controllers/appointmentStatus.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";
const router = express.Router();


// GET /api/doctor/appointments/today
router.get("/appointments/today", requireVerifiedDoctor, getTodayAppointmentsController);

// get pending appointments
router.get("/appointments/pending", requireVerifiedDoctor, getPendingAppointmentsController);

//approve/reject appointment
router.patch("/appointments/:appointmentId/decision", requireVerifiedDoctor, decideAppointmentController);

export default router; 