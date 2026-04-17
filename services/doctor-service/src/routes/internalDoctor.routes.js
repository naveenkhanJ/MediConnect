import express from "express";
import Doctor from "../models/doctorProfile.model.js";

const router = express.Router();

const internalOnly = (req, res, next) => {
  const secret = req.headers["x-internal-secret"];
  if (secret !== (process.env.INTERNAL_SECRET || "mediconnect-internal")) {
    return res.status(403).json({ message: "Forbidden." });
  }
  next();
};

router.get("/:id", internalOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      attributes: ["id", "fullName", "email", "speciality", "licenseNumber", "consultationType", "fees", "isVerified"],
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctor.", error: err.message });
  }
});

router.get("/", internalOnly, async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      attributes: ["id", "fullName", "email", "speciality", "licenseNumber", "consultationType", "fees", "isVerified", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors.", error: err.message });
  }
});

router.patch("/:id/verify", internalOnly, async (req, res) => {
  try {
    const isVerified = req.body.isVerified ?? true;
    const [doctor, created] = await Doctor.upsert(
      { id: req.params.id, isVerified },
      { returning: true }
    );
    res.json({ message: `Doctor ${isVerified ? "verified" : "rejected"} successfully.`, doctor, created });
  } catch (err) {
    res.status(500).json({ message: "Failed to update doctor.", error: err.message });
  }
});

export default router;
