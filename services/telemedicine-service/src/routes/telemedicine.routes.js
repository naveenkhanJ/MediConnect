import express from "express";
import {
  createSession,
  getSessionById,
  getSessionByAppointmentId,
  startSession,
  endSession,
  cancelSession,
  joinSession,
  listSessions,
} from "../controllers/telemedicine.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Internal service-to-service route — no auth required
router.post("/internal", createSession);

router.get("/", authenticate, listSessions);
router.post("/", authenticate, createSession);
router.get("/appointment/:appointmentId", authenticate, getSessionByAppointmentId);
router.get("/:id", authenticate, getSessionById);
router.patch("/:id/start", authenticate, startSession);
router.patch("/:id/end", authenticate, endSession);
router.patch("/:id/cancel", authenticate, cancelSession);
router.post("/:id/join", authenticate, joinSession);

export default router;