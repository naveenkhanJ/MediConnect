import express from "express";
import { getAllDoctors, verifyDoctor, rejectDoctor, getAllPatients } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/doctors", getAllDoctors);
router.patch("/doctors/:id/verify", verifyDoctor);
router.patch("/doctors/:id/reject", rejectDoctor);
router.get("/patients", getAllPatients);

export default router;
