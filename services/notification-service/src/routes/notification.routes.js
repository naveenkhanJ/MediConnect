import express from "express";
import {
  appointmentBooked,
  consultationCompleted,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.post("/appointment-booked", appointmentBooked);
router.post("/consultation-completed", consultationCompleted);

export default router;

