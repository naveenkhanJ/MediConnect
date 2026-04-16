import express from "express";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { createPrescriptionController, downloadPrescriptionPDFController, getAllPrescriptionsController, getPatientPrescriptionController } from "../controllers/prescription.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";

const router = express.Router();

router.post("/",fakeAuth,requireVerifiedDoctor,createPrescriptionController);
router.get("/",fakeAuth,requireVerifiedDoctor,getAllPrescriptionsController);
router.get("/patient/:patientId",fakeAuth,getPatientPrescriptionController);
router.get("/:id/pdf",fakeAuth,downloadPrescriptionPDFController);

export default router;