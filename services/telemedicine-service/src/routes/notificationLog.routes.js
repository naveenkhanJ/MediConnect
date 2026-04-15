import express from "express";
import { listNotificationLogs } from "../controllers/notificationLog.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get("/", listNotificationLogs);

export default router;
