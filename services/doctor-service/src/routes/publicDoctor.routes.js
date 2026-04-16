import express from "express";
import {
  listDoctorsController,
  getDoctorByIdController,
  getDoctorAvailabilityController
} from "../controllers/publicDoctor.controller.js";

const router = express.Router();

router.get("/", listDoctorsController);
router.get("/:id/availability", getDoctorAvailabilityController);
router.get("/:id", getDoctorByIdController);

export default router;
