import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const jwtSecret = process.env.JWT_SECRET || 'supersecretkey';

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await pool.query(
      'SELECT id, name, email, password, age, gender, contact FROM patients WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const patient = result.rows[0];
    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {
        id: patient.id,
        email: patient.email,
        name: patient.name,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        contact: patient.contact,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export { loginPatient };
