import express from "express";
import { decideAppointment, fetchPendingAppointments } from "../controllers/appointmentStatus.controller.js";

const router = express.Router();

// get pending appointments
router.get("/appointments/pending",fetchPendingAppointments);

//approve/reject appointment
router.patch("/appointments/decision",decideAppointment);

export default router; 