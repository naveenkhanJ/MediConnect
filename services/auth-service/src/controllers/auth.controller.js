
import axios from "axios";
import { registerService, loginService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { email, password, role, name, age, gender, contact } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Validation Error",
        error: "email, password, and role are required"
      });
    }

    // 1. Create user in Auth DB
    const user = await registerService(email, password, role);

    // 2. If patient → create patient profile
    if (role === "patient") {
      if (!name || age === undefined || age === null || !gender || !contact) {
        return res.status(400).json({
          message: "Validation Error",
          error: "name, age, gender, and contact are required for patient role"
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