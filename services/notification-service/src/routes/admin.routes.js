import express from "express";
import {
  listNotificationLogs,
  resendNotification,
} from "../controllers/admin.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get("/notifications", listNotificationLogs);
router.post("/notifications/:id/resend", resendNotification);

export default router;

