
import axios from "axios";
import { registerService, loginService } from "../services/auth.service.js";
import { deleteUser } from "../models/user.model.js";

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
    const { user, token } = await registerService(email, password, role);

    // Track if we need to rollback this user if profile creation fails
    let userCreatedId = user.id;

    try {
      // 2. Handle role-based profile creation
      if (role === "patient") {
        if (!name || age == null || !gender || !contact) {
          throw new Error("name, age, gender, contact required for patient");
        }

        await axios.post("http://localhost:5002/api/patients/register", {
          user_id: user.id,
          email,
          password,
          name,
          age,
          gender,
          contact,
        });
      } else if (role === "doctor") {
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
          throw new Error(
            "fullName/name, speciality/specialization, licenseNumber/license_no, phone/contact, fees required for doctor"
          );
        }

        // doctor-service runs on 5009 and uses `id` as the doctorId (integer).
        await axios.post("http://localhost:5009/api/profile/register", {
          id: user.id,
          email,
          password,
          fullName: resolvedFullName,
          phone: resolvedPhone,
          speciality: resolvedSpeciality,
          consultationType,
          experience,
          licenseNumber: resolvedLicenseNumber,
          fees: Number(fees),
          bio,
          image,
        });
      }

      // admin → no extra service call
      else if (role === "admin") {
        // optional: create admin profile service if needed
      }

      res.status(201).json({
        message: "User registered successfully",
        user,
        token, // Return token as well for immediate login if approved
      });
    } catch (profileErr) {
      // ROLLBACK: Delete the user from Auth DB if profile creation failed
      console.log("Profile creation failed, rolling back user registration:", profileErr.message);
      if (userCreatedId) {
        await deleteUser(userCreatedId);
      }
      throw profileErr; // Re-throw to be caught by the outer catch block
    }

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