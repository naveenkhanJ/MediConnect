import express from "express";
import { createProfileController, getProfileController, updateProfileController } from "../controllers/doctorProfile.controller.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";

const router = express.Router();

router.post("/",fakeAuth,createProfileController)
router.get("/me",fakeAuth,getProfileController);
router.put("/me",fakeAuth,updateProfileController);

export default router;