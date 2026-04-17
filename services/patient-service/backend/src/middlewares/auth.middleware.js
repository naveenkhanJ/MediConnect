import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import pool from '../config/db.js';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;


const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded?.role && decoded.role !== 'patient') {
      return res.status(403).json({ message: 'Forbidden. Patient access only.' });
    }

    const email = decoded?.email;
    if (!email) {
      return res.status(401).json({ message: 'Invalid token payload (missing email).' });
    }

    const result = await pool.query(
      'SELECT id, name, email, age, gender, contact FROM patients WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Patient profile not found for this token.' });
    }

    const patient = result.rows[0];

    req.patient = { ...decoded, authUserId: decoded.id, id: patient.id };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;