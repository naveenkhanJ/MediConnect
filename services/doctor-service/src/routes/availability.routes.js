import express from "express";
import { addAvailabilityController, deleteAvailabilityController, getAvailabilityController, updateAvailabilityController } from "../controllers/availability.controller.js";

const router = express.Router();

router.get("/",getAvailabilityController);
router.post("/",addAvailabilityController);
router.put("/:id", updateAvailabilityController);
router.delete("/:id",deleteAvailabilityController);

export default router;