import express from "express";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listDoctorVerifications,
  submitDoctorVerification,
  reviewDoctorVerification,
} from "../controllers/admin.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get("/users", listUsers);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/doctor-verifications", listDoctorVerifications);
router.post("/doctor-verifications", submitDoctorVerification);
router.patch("/doctor-verifications/:id/review", reviewDoctorVerification);

export default router;
