import express from "express";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { createPrescriptionController, downloadPrescriptionPDFController, getAllPrescriptionsController, getPatientPrescriptionController } from "../controllers/prescription.controller.js";

const router = express.Router();

router.post("/",fakeAuth,createPrescriptionController);
router.get("/",fakeAuth,getAllPrescriptionsController);
router.get("/patient/:patientId",fakeAuth,getPatientPrescriptionController);
router.get("/:id/pdf",fakeAuth,downloadPrescriptionPDFController);

export default router;