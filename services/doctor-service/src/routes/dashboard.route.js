import express from "express";
import { getDashboardSummaryController } from "../controllers/dashboard.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";

const router = express.Router();

router.get("/summary", requireVerifiedDoctor, getDashboardSummaryController);

export default router;