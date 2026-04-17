import axios from "axios";
import { updateUserApproval, findAllDoctors } from "../models/user.model.js";

const DOCTOR_SERVICE = process.env.DOCTOR_SERVICE_URL || "http://localhost:5009";
const PATIENT_SERVICE = process.env.PATIENT_SERVICE_URL || "http://localhost:5002";

export const getAllDoctors = async (req, res) => {
  try {
    // 1. Fetch master list of doctors from Auth DB
    const authDoctors = await findAllDoctors();

    // 2. Fetch profile details from Doctor Service
    let profiles = [];
    try {
      const resp = await axios.get(`${DOCTOR_SERVICE}/internal/doctors`, {
        headers: { "x-internal-secret": process.env.INTERNAL_SECRET || "mediconnect-internal" },
      });
      profiles = resp.data;
    } catch (e) {
      console.error("Doctor Service profiles temporarily unavailable:", e.message);
      // We continue with empty profiles so the master list is still shown
    }

    // 3. Merge profiles into the master list
    const combined = authDoctors.map((authDoc) => {
      const profile = profiles.find((p) => Number(p.id) === Number(authDoc.id));
      return {
        ...authDoc,
        // Map profile fields if found, otherwise keep auth basic info
        fullName: profile?.fullName || "Profile Pending",
        speciality: profile?.speciality || "N/A",
        licenseNumber: profile?.licenseNumber || "N/A",
        experience: profile?.experience || "N/A",
        fees: profile?.fees || 0,
        consultationType: profile?.consultationType || "N/A",
        createdAt: authDoc.created_at,
        // Sync verification status from Auth Source of Truth
        is_approved: authDoc.is_approved,
        isVerified: authDoc.is_approved, // map for frontend compatibility
      };
    });

    res.json(combined);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors list.", error: err.message });
  }
};

export const verifyDoctor = async (req, res) => {
  try {
    // 1. Update doctor profile status
    await axios.patch(
      `${DOCTOR_SERVICE}/internal/doctors/${req.params.id}/verify`,
      { isVerified: true },
      { headers: { "x-internal-secret": process.env.INTERNAL_SECRET || "mediconnect-internal" } }
    );

    // 2. Update local auth approval status
    await updateUserApproval(req.params.id, true);

    res.json({ message: "Doctor verified and approved successfully." });
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Failed to verify doctor." });
  }
};

export const rejectDoctor = async (req, res) => {
  try {
    // 1. Update doctor profile status
    await axios.patch(
      `${DOCTOR_SERVICE}/internal/doctors/${req.params.id}/verify`,
      { isVerified: false },
      { headers: { "x-internal-secret": process.env.INTERNAL_SECRET || "mediconnect-internal" } }
    );

    // 2. Update local auth approval status
    await updateUserApproval(req.params.id, false);

    res.json({ message: "Doctor verification revoked." });
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Failed to reject doctor." });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    // This calls the patient-service (we'll implement this endpoint next)
    const response = await axios.get(`${PATIENT_SERVICE}/api/patients/internal/all`, {
      headers: { "x-internal-secret": process.env.INTERNAL_SECRET || "mediconnect-internal" },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Failed to fetch patients." });
  }
};
