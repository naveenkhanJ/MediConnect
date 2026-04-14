import express from "express";
import { checkSymptoms } from "../controllers/symptom.controller.js";


const router = express.Router();

router.post("/check",checkSymptoms);

export default router;