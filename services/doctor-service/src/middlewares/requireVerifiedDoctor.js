import { doctorProfileRepository } from "../repositories/doctorProfile.repository.js";

export const requireVerifiedDoctor = async (req, res, next) => {
  try {
    // 1. Must be logged in
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2. Must be doctor
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors allowed" });
    }

    // 3. Fetch REAL doctor profile using logged-in user
    const profile = await doctorProfileRepository.findByDoctorId(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // 4. Check verification status
    if (!profile.isVerified) {
      return res.status(403).json({
        message: "Profile not verified. Access denied."
      });
    }

    // 5. Attach profile for next middlewares/controllers
    req.doctorProfile = profile;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};