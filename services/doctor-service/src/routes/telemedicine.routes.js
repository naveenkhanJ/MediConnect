import express from "express";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { createSessionController, endSessionController, getSessionByAppointmentController, joinSessionController, startSessionController } from "../controllers/telemedicine.controller.js";


const router = express.Router();

router.post("/",fakeAuth,createSessionController);
router.post("/:id/join",fakeAuth,joinSessionController);
router.patch("/:id/start",fakeAuth,startSessionController);
router.patch("/:id/end",fakeAuth,endSessionController);
router.get("/appointment/:appointmentId",fakeAuth,getSessionByAppointmentController);

export default router;