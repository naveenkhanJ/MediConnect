import express from "express";
import { getDashboardSummaryController } from "../controllers/dashboard.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";

const router = express.Router();

router.get("/summary", fakeAuth, getDashboardSummaryController);

export default router;