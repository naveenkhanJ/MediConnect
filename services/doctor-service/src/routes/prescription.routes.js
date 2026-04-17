import express from "express";
import { createPrescriptionController, downloadPrescriptionPDFController, getAllPrescriptionsController, getPatientPrescriptionController } from "../controllers/prescription.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";

const router = express.Router();

router.post("/", requireVerifiedDoctor, createPrescriptionController);
router.get("/", requireVerifiedDoctor, getAllPrescriptionsController);
router.get("/patient/:patientId", requireVerifiedDoctor, getPatientPrescriptionController);
router.get("/:id/pdf", requireVerifiedDoctor, downloadPrescriptionPDFController);

export default router;