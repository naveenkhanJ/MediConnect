import express from "express";
import { fetchPatientReport } from "../controllers/report.controller.js";

const router = express.Router();
//to get patient report
router.get("/patients/:patientId/reports",fetchPatientReport);

export default router;