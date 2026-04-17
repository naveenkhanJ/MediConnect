import pool from "../config/db.config.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const createUser = async (email, password, role, isApproved = true) => {
  const result = await pool.query(
    "INSERT INTO users (email, password, role, is_approved) VALUES ($1, $2, $3, $4) RETURNING *",
    [email, password, role, isApproved]
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};

export const updateUserApproval = async (id, isApproved) => {
  await pool.query("UPDATE users SET is_approved = $1 WHERE id = $2", [isApproved, id]);
};

export const findAllDoctors = async () => {
  const result = await pool.query(
    "SELECT id, email, role, is_approved, created_at FROM users WHERE role = 'doctor' ORDER BY created_at DESC"
  );
  return result.rows;
};