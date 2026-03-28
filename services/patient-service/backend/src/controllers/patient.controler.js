//register a new patient

const bcrypt = require('bcrypt');
const pool = require('../config/db');

const registerPatient = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO patients (name, email, password, age)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email`,
      [name, email, hashedPassword, age]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//view profile of a patient

const getProfile = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'SELECT id, name, email, age FROM patients WHERE id=$1',
    [id]
  );

  res.json(result.rows[0]);
};

//update profile of a patient
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  const result = await pool.query(
    `UPDATE patients SET name=$1, age=$2 WHERE id=$3 RETURNING *`,
    [name, age, id]
  );

  res.json(result.rows[0]);
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