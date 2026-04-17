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



//view profile of a patient

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(req.patient?.id) !== String(id)) {
      return res.status(403).json({ message: 'Forbidden. You can only view your own profile.' });
    }

    const result = await pool.query(
      'SELECT id, name, email, age, gender, contact FROM patients WHERE id=$1',
      [id]
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

  if (String(req.patient?.id) !== String(id)) {
    return res.status(403).json({ message: 'Forbidden. You can only update your own profile.' });
  }

  const result = await pool.query(
    `UPDATE patients SET name=$1, email=$2, age=$3, gender=$4, contact=$5 WHERE id=$6 RETURNING *`,
    [name, email, age, gender, contact, id]
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


// delete patient account
const deleteAccount = async (req, res) => {
  const { id } = req.params;

  // Ensure user can only delete own account
  if (String(req.patient?.id) !== String(id)) {
    return res.status(403).json({
      message: "Forbidden. You can only delete your own account.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete related data (ONLY if these tables exist in THIS service DB)
    await client.query("DELETE FROM reports WHERE patient_id = $1", [id]);
    await client.query("DELETE FROM appointments WHERE patient_id = $1", [id]);



    // Delete patient
    const deleted = await client.query(
      "DELETE FROM patients WHERE id = $1 RETURNING id, name, email",
      [id]
    );

    if (deleted.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Patient not found" });
    }

    await client.query("COMMIT");

    res.json({
      message: "Account deleted successfully",
      patient: deleted.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete Account Error:", err.message);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  } finally {
    client.release();
  }
};

export default deleteAccount;

//create doctor appointment
const createDoctorAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, timeSlot, consultationType } = req.body;

    const response = await fetch('http://localhost:5003/api/appointments/internal', {
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


// Internal service-to-service: returns email + contact (phone) for a given patient id
// No JWT required — only reachable within the private service network
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

export { registerPatient, getProfile, updateProfile, uploadReport, bookAppointment, getPrescriptions, createDoctorAppointment,deleteAccount,getReports };
