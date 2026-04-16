export const requireVerifiedDoctor = async (req, res, next) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors allowed" });
    }

    const profile = await doctorProfileRepository.findByDoctorId(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    if (!profile.isVerified) {
      return res.status(403).json({
        message: "Profile not verified. Access denied."
      });
    }

    req.doctorProfile = profile; // optional for reuse
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};