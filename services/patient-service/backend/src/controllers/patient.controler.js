//register a new patient
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import dotenv from "dotenv";
dotenv.config();


const registerPatient = async (req, res) => {
  try {
    const { name, email, password, age,gender,contact } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO patients (name, email, password, age, gender, contact)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email`,
      [name, email, hashedPassword, age, gender, contact]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
//patient login

// view profile for logged-in patient (no id in URL)
const getMyProfile = async (req, res) => {
  try {
    const patientId = req.patient?.id;
    if (!patientId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const result = await pool.query(
      'SELECT id, name, email, age, gender, contact FROM patients WHERE id=$1',
      [patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};

//view profile of a patient

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const patientId = req.patient?.id;
    const authUserId = req.patient?.authUserId;

    if (String(patientId) !== String(id) && String(authUserId) !== String(id)) {
      return res.status(403).json({ message: 'Forbidden. You can only view your own profile.' });
    }

    const result = await pool.query(
      'SELECT id, name, email, age, gender, contact FROM patients WHERE id=$1',
      [patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
};

//update profile of a patient
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, age, gender, contact } = req.body;

  const patientId = req.patient?.id;
  const authUserId = req.patient?.authUserId;

  if (String(patientId) !== String(id) && String(authUserId) !== String(id)) {
    return res.status(403).json({ message: 'Forbidden. You can only update your own profile.' });
  }

  const result = await pool.query(
    `UPDATE patients SET name=$1, email=$2, age=$3, gender=$4, contact=$5 WHERE id=$6 RETURNING *`,
    [name, email, age, gender, contact, patientId]
  );

  res.json(result.rows[0]);
};

//upload report for a patient
const uploadReport = async (req, res) => {
  try {
    const { report_name, file_url, description } = req.body;
    const patient_id = req.patient.id;

    const result = await pool.query(
      `INSERT INTO reports (patient_id, report_name, file_url, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [patient_id, report_name, file_url, description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

//view reports for logged-in patient
const getReports = async (req, res) => {
  try {
    const patient_id = req.patient.id;

    const result = await pool.query(
      `SELECT id, patient_id, report_name, file_url, description
       FROM reports
       WHERE patient_id=$1
       ORDER BY id DESC`,
      [patient_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

//book an appointment for a patient
const bookAppointment = async (req, res) => {
  const patient_id = req.patient.id;
  const { doctor_id, appointment_date } = req.body;

  const result = await pool.query(
    `INSERT INTO appointments (patient_id, doctor_id, appointment_date)
     VALUES ($1, $2, $3) RETURNING *`,
    [patient_id, doctor_id, appointment_date]
  );

  res.json(result.rows[0]);
};


//view presscriptions for a patient
const getPrescriptions = async (req, res) => {
  const { patient_id } = req.params;

  const result = await pool.query(
    `SELECT * FROM prescriptions WHERE patient_id=$1`,
    [patient_id]
  );

  res.json(result.rows);
};

//delete patient account (and related data)
const deleteAccount = async (req, res) => {
  const { id } = req.params;

  const patientId = req.patient?.id;
  const authUserId = req.patient?.authUserId;

  if (String(patientId) !== String(id) && String(authUserId) !== String(id)) {
    return res.status(403).json({ message: 'Forbidden. You can only delete your own account.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Avoid FK constraint errors if cascades aren't set.
    await client.query('DELETE FROM reports WHERE patient_id=$1', [patientId]);
    await client.query('DELETE FROM appointments WHERE patient_id=$1', [patientId]);
    await client.query('DELETE FROM prescriptions WHERE patient_id=$1', [patientId]);

    const deleted = await client.query(
      'DELETE FROM patients WHERE id=$1 RETURNING id, name, email',
      [patientId]
    );

    await client.query('COMMIT');

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Account deleted successfully', patient: deleted.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

//create doctor appointment
const createDoctorAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, timeSlot, consultationType } = req.body;

    const appointmentServiceUrl = process.env.APPOINTMENT_SERVICE_URL || "http://appointment-service:5003";

    const response = await fetch(`${appointmentServiceUrl}/api/appointments/internal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        doctorId,
        appointmentDate,
        timeSlot,
        consultationType: consultationType || 'ONLINE'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getPatientContactInternal = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, contact FROM patients WHERE id=$1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllPatientsInternal = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, age, gender, contact, created_at FROM patients ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { registerPatient, getMyProfile, getProfile, updateProfile, uploadReport, bookAppointment, getPrescriptions, createDoctorAppointment,deleteAccount,getReports, getAllPatientsInternal, getPatientContactInternal };
