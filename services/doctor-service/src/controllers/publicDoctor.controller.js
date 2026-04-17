import { doctorProfileRepository } from "../repositories/doctorProfile.repository.js";
import { findAvailabilityByDoctorId } from "../repositories/availability.repository.js";
import { Op } from "sequelize";
import Availability from "../models/availability.model.js";

// GET /api/doctors?speciality=xxx  OR all doctors
export const listDoctorsController = async (req, res) => {
  try {
    const doctors = req.query.speciality
      ? await doctorProfileRepository.findBySpeciality(req.query.speciality)
      : await doctorProfileRepository.findAll();

    // Strip sensitive fields before sending to frontend
    const safe = doctors.map(({ id, fullName, speciality, category, experience, consultationType, fees, image, bio, isVerified }) => ({
      id, fullName, speciality, category, experience, consultationType, fees, image, bio, isVerified
    }));

    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctors/:id
export const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorProfileRepository.findByDoctorId(String(req.params.id));
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const { id, fullName, speciality, category, experience, consultationType, fees, image, bio, isVerified } = doctor;
    res.json({ id, fullName, speciality, category, experience, consultationType, fees, image, bio, isVerified });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctors/:id/availability
export const getDoctorAvailabilityController = async (req, res) => {
  try {
    // Use local date to avoid UTC shifting issues (e.g. UTC+5:30 timezone)
    const now = new Date();
    const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const slots = await Availability.findAll({
      where: {
        doctorId: String(req.params.id),
        date: { [Op.gte]: localToday }
      },
      order: [["date", "ASC"], ["startTime", "ASC"]]
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
