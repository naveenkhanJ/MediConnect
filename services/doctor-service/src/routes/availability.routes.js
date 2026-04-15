import express from "express";
import { addAvailabilityController, deleteAvailabilityController, getAvailabilityController, updateAvailabilityController } from "../controllers/availability.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";
const router = express.Router();

router.get("/",fakeAuth,getAvailabilityController);
router.post("/",fakeAuth,addAvailabilityController);
router.put("/:id",fakeAuth, updateAvailabilityController);
router.delete("/:id",fakeAuth,deleteAvailabilityController);

export default router;