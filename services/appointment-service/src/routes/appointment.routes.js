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
  failPayment
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/doctors/search", searchDoctorsController);
router.post("/", fakeAuth, createAppointmentController);
router.put("/:id/reschedule", fakeAuth, rescheduleAppointmentController);
router.put("/:id/cancel", fakeAuth, cancelAppointmentController);
router.get("/:id/status", fakeAuth, getAppointmentStatusController);
router.get("/my/list", fakeAuth, getMyAppointmentsController);
router.put("/:id/confirm-payment", confirmPaymentController);
router.put("/:id/fail-payment", failPayment);

export default router;