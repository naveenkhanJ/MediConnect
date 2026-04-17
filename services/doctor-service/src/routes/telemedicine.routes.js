import express from "express";
import { fakeAuth } from "../middlewares/fakeAuth.js";
import { createSessionController, endSessionController, getSessionByAppointmentController, joinSessionController, startSessionController } from "../controllers/telemedicine.controller.js";
import { requireVerifiedDoctor } from "../middlewares/requireVerifiedDoctor.js";


const router = express.Router();

router.post("/",fakeAuth,requireVerifiedDoctor,createSessionController);
router.post("/:id/join",fakeAuth,requireVerifiedDoctor,requireVerifiedDoctor,joinSessionController);
router.patch("/:id/start",fakeAuth,requireVerifiedDoctor,startSessionController);
router.patch("/:id/end",fakeAuth,requireVerifiedDoctor,endSessionController);
router.get("/appointment/:appointmentId",fakeAuth,requireVerifiedDoctor,getSessionByAppointmentController);

export default router;