import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

import { registerPatient, getProfile, updateProfile, uploadReport, createDoctorAppointment,deleteAccount,getReports } from '../controllers/patient.controler.js';

const router = express.Router();

// Register a new patient
router.post('/register', registerPatient);

// Internal service-to-service endpoint — returns email + contact only, no user auth required

// Get patient profile
router.get('/:id', authMiddleware, getProfile);

// Update patient profile
router.put('/:id', authMiddleware, updateProfile);

// Upload report for a patient
router.post('/reports', authMiddleware, uploadReport);

//view reports for a patient
router.get('/reports', authMiddleware, getReports);

//delete patient account
router.delete('/:id', authMiddleware, deleteAccount);

// Create doctor appointment
router.post('/appointments', authMiddleware, createDoctorAppointment);

export default router;