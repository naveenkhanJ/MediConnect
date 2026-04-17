
import axios from "axios";
import { registerService, loginService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role,

      // common
      name,
      fullName,

      // patient fields
      age,
      gender,
      contact,

      // doctor fields
      specialization,
      speciality,
      consultationType,
      experience,
      license_no,
      licenseNumber,
      phone,
      fees,
      bio,
      image
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Validation Error",
        error: "email, password, and role are required"
      });
    }

    // 1. Create user in Auth DB
    const user = await registerService(email, password, role);

    // 2. Handle role-based profile creation
    if (role === "patient") {
      if (!name || age == null || !gender || !contact) {
        return res.status(400).json({
          message: "Validation Error",
          error: "name, age, gender, contact required for patient"
        });
      }

      await axios.post("http://localhost:5002/api/patients/register", {
        user_id: user.id,
        email,
        password,
        name,
        age,
        gender,
        contact
      });
    }

    else if (role === "doctor") {
      // Support both legacy keys (name/contact/specialization/license_no)
      // and new doctor-service model keys (fullName/phone/speciality/licenseNumber).
      const resolvedFullName = fullName || name;
      const resolvedPhone = phone || contact;
      const resolvedSpeciality = speciality || specialization;
      const resolvedLicenseNumber = licenseNumber || license_no;

      if (
        !resolvedFullName ||
        !resolvedSpeciality ||
        !resolvedLicenseNumber ||
        resolvedPhone == null ||
        fees == null
      ) {
        return res.status(400).json({
          message: "Validation Error",
          error:
            "fullName/name, speciality/specialization, licenseNumber/license_no, phone/contact, fees required for doctor"
        });
      }

      // doctor-service runs on 5009 and uses `id` as the doctorId (UUID primary key).
      await axios.post("http://localhost:5009/api/profile/register", {
        id: user.id,
        email,
        password,
        fullName: resolvedFullName,
        phone: resolvedPhone,
        speciality: resolvedSpeciality,
        consultationType,
        // keep experience for backward compatibility (doctor-service model may ignore it)
        experience,
        licenseNumber: resolvedLicenseNumber,
        fees,
        bio,
        image
      });
    }

    // admin → no extra service call
    else if (role === "admin") {
      // optional: create admin profile service if needed
    }

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (err) {
    const statusCode = err.statusCode || err.response?.status || 500;

    console.log("FULL ERROR:", err.response?.data || err.message);

    res.status(statusCode).json({
      message: statusCode >= 500 ? "Server Error" : "Request Failed",
      error: err.response?.data || err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await loginService(email, password);

    res.json({ message: "Login successful", ...data });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};