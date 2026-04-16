import { doctorProfileRepository } from "../repositories/doctorProfile.repository.js";

export const requireVerifiedDoctor = async (req, res, next) => {
  try {
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const doctor = await doctorProfileRepository.findByDoctorId(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    if (!doctor.isVerified) {
      return res.status(403).json({ message: "Doctor account is not verified yet" });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    next(error);
  }
};
