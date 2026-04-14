import express from "express";
import {
  createPaymentController,
  getPaymentByIdController,
  getPaymentByAppointmentIdController,
  markPaymentSuccessController,
  markPaymentFailedController
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", createPaymentController);
router.get("/appointment/:appointmentId", getPaymentByAppointmentIdController);
router.get("/:id", getPaymentByIdController);
router.put("/:id/success", markPaymentSuccessController);
router.put("/:id/fail", markPaymentFailedController);

export default router;