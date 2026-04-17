import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

import { registerPatient, getMyProfile, getProfile, updateProfile, uploadReport, createDoctorAppointment,deleteAccount,getReports, getAllPatientsInternal, getPatientContactInternal } from '../controllers/patient.controler.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

// Middleware for internal service-to-service calls
const internalOnly = (req, res, next) => {
  const secret = req.headers["x-internal-secret"];
  if (secret !== (process.env.INTERNAL_SECRET || "mediconnect-internal")) {
    return res.status(403).json({ message: "Forbidden." });
  }
  next();
};

// Internal service-to-service endpoints
router.get('/internal/all', internalOnly, getAllPatientsInternal);
router.get('/internal/:id', internalOnly, getPatientContactInternal);

// Register a new patient
router.post('/register', registerPatient);

// Get logged-in patient's own profile (must be before /:id to avoid route conflict)
router.get('/me', authMiddleware, getMyProfile);

// Get patient profile by id
router.get('/:id', authMiddleware, getProfile);

// Update patient profile
router.put('/:id', authMiddleware, updateProfile);

// Upload report for a patient
router.post('/reports', authMiddleware, upload.single('file'), uploadReport);


//view reports for a patient
router.get('/reports', authMiddleware, getReports);

//delete patient account
router.delete('/:id', authMiddleware, deleteAccount);

// Create doctor appointment
router.post('/appointments', authMiddleware, createDoctorAppointment);

export default router;