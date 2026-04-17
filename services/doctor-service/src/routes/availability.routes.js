import express from "express";
import { addAvailabilityController, deleteAvailabilityController, getAvailabilityController, updateAvailabilityController } from "../controllers/availability.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";
const router = express.Router();

router.get("/", requireVerifiedDoctor, getAvailabilityController);
router.post("/", requireVerifiedDoctor, addAvailabilityController);
router.put("/:id", requireVerifiedDoctor, updateAvailabilityController);
router.delete("/:id", requireVerifiedDoctor, deleteAvailabilityController);

export default router;