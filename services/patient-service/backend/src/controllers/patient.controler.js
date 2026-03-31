//register a new patient

import bcrypt from 'bcrypt';
import pool from '../config/db.js';


const registerPatient = async (req, res) => {
  try {
    const { name, email, password, age,gender,contact } = req.body;

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

//view profile of a patient

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, email, age, gender, contact FROM patients WHERE id=$1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//update profile of a patient
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name,email, age, gender, contact } = req.body;

  const result = await pool.query(
    `UPDATE patients SET name=$1, email=$2, age=$3, gender=$4, contact=$5 WHERE id=$6 RETURNING *`,
    [name, email, age, gender, contact, id]
  );

  res.json(result.rows[0]);
};

//upload report for a patient

const uploadReport = async (req, res) => {
  try {
    const { patient_id, report_name, file_url, description } = req.body;

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

//book an appointment for a patient
const bookAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date } = req.body;

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


export { registerPatient, getProfile, updateProfile, uploadReport, bookAppointment, getPrescriptions };