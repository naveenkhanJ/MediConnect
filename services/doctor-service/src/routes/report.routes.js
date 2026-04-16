// routes/report.routes.js
import express from "express";
import { fetchPatientReport } from "../controllers/report.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";

const router = express.Router();

router.get(
  "/appointments/:appointmentId/reports",
  fakeAuth,
  requireVerifiedDoctor,
  fetchPatientReport
);

export default router;