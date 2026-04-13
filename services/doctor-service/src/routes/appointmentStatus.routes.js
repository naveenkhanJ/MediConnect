import express from "express";
import { decideAppointmentController, fetchPendingAppointments } from "../controllers/appointmentStatus.controller.js";

const router = express.Router();

// get pending appointments
router.get("/appointments/pending",fetchPendingAppointments);

//approve/reject appointment
router.patch("/appointments/:appointmentId/decision",decideAppointmentController);

export default router; 