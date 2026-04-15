import express from "express";
import { createPrescriptionController, downloadPrescriptionPDFController, getAllPrescriptionsController, getPatientPrescriptionController } from "../controllers/prescription.controller.js";

const router = express.Router();

router.post("/",createPrescriptionController);
router.get("/",getAllPrescriptionsController);
router.get("/patient/:patientId",getPatientPrescriptionController);
router.get("/:id/pdf",downloadPrescriptionPDFController);

export default router;