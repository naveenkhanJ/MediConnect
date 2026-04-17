import express from "express";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import {
  searchDoctorsController,
  createAppointmentController,
  rescheduleAppointmentController,
  cancelAppointmentController,
  getAppointmentStatusController,
  getMyAppointmentsController,
  confirmPaymentController,
  failPayment,
  getAppointmentByIdController,
  getDoctorPendingAppointmentsController,
  handleDoctorDecisionController,
  getDoctorTodayAppointmentsController
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/doctors/search", searchDoctorsController);
router.post("/", fakeAuth, createAppointmentController);
router.post("/internal", createAppointmentController); // without auth
router.put("/:id/reschedule", fakeAuth, rescheduleAppointmentController);
router.put("/:id/cancel", fakeAuth, cancelAppointmentController);
router.get("/:id/status", fakeAuth, getAppointmentStatusController);
router.get("/my/list", fakeAuth, getMyAppointmentsController);
router.put("/:id/confirm-payment", confirmPaymentController);
router.put("/:id/fail-payment", failPayment);

// Doctor-facing internal endpoints (called by doctor-service)
router.get("/doctor/:doctorId/pending", getDoctorPendingAppointmentsController);
router.get("/doctor/:doctorId/today", getDoctorTodayAppointmentsController);
router.patch("/:id/decision", handleDoctorDecisionController);
router.get("/:id", getAppointmentByIdController);

export default router;