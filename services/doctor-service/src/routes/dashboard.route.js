import express from "express";
import { getDashboardSummaryController } from "../controllers/dashboard.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";

const router = express.Router();

router.get("/summary", fakeAuth,requireVerifiedDoctor, getDashboardSummaryController);

export default router;