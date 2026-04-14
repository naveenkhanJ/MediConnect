import express from "express";
import { decideAppointmentController, getPendingAppointmentsController } from "../controllers/appointmentStatus.controller.js";

const router = express.Router();

// get pending appointments
router.get("/appointments/pending",getPendingAppointmentsController);

//approve/reject appointment
router.patch("/appointments/:appointmentId/decision",decideAppointmentController);

export default router; 