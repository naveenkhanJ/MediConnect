import express from "express";
import { startTelemedicineController } from "../controllers/doctorTelemedicine.controller.js";

const router = express.Router();

router.post("/start/:appointmentId",startTelemedicineController);


export default router;