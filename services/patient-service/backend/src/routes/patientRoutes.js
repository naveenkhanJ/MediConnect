import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

import { registerPatient, getProfile, updateProfile, uploadReport, createDoctorAppointment } from '../controllers/patient.controler.js';

const router = express.Router();

// Register a new patient
router.post('/register', registerPatient);

// Get patient profile
router.get('/:id', authMiddleware, getProfile);

// Update patient profile
router.put('/:id', authMiddleware, updateProfile);

// Upload report for a patient
router.post('/reports', authMiddleware, uploadReport);

// Create doctor appointment
router.post('/appointments', authMiddleware, createDoctorAppointment);

export default router;