import express from "express";
import {
  createPaymentController,
  getPaymentByIdController,
  getPaymentByAppointmentIdController,
  markPaymentSuccessController,
  markPaymentFailedController,
  getPayhereParamsController,
  payhereNotifyController
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", createPaymentController);
router.get("/appointment/:appointmentId", getPaymentByAppointmentIdController);

// Returns all PayHere form fields including the hash (hash is generated server-side)
router.get("/payhere-params/:paymentId", getPayhereParamsController);

// PayHere calls this URL after payment (success or failure)
router.post("/payhere-notify", payhereNotifyController);

router.get("/:id", getPaymentByIdController);
router.put("/:id/success", markPaymentSuccessController);
router.put("/:id/fail", markPaymentFailedController);

export default router;
