import express from 'express';
import { registerPatient, getProfile, updateProfile ,uploadReport} from '../controllers/patient.controler.js';

const router = express.Router();

// Register a new patient
router.post('/register', registerPatient);

// Get patient profile
router.get('/:id', getProfile);

// Update patient profile
router.put('/:id', updateProfile);

//upload report for a patient
router.post('/reports', uploadReport);

export default router;