import express from 'express';
import { registerPatient, getProfile, updateProfile } from '../controllers/patient.controler.js';

const router = express.Router();

// Register a new patient
router.post('/register', registerPatient);

// Get patient profile
router.get('/:id', getProfile);

// Update patient profile
router.put('/:id', updateProfile);

export default router;