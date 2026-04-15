import express from "express";
import { decideAppointmentController, getPendingAppointmentsController } from "../controllers/appointmentStatus.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";
const router = express.Router();

// get pending appointments
router.get("/appointments/pending",fakeAuth,getPendingAppointmentsController);

//approve/reject appointment
router.patch("/appointments/:appointmentId/decision",fakeAuth,decideAppointmentController);

export default router; 