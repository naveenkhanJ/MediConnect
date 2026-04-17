// routes/report.routes.js
import express from "express";
import { fetchPatientReport } from "../controllers/report.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";

const router = express.Router();

router.get(
  "/appointments/:appointmentId/reports",
  requireVerifiedDoctor,
  fetchPatientReport
);

export default router;