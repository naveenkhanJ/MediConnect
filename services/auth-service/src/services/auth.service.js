import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";



export const registerService = async (email, password, role) => {

  if (!email || typeof email !== "string") {
    throw new Error("Email is required");
  }

  if (!password || typeof password !== "string") {
    throw new Error("Password is required");
  }

  if (!role || typeof role !== "string") {
    throw new Error("Role is required");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 409;
    throw err;
  }

  // 🔥 HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser(email, hashedPassword, role);

  const token = generateToken(user);

  return { user, token };
};



export const loginService = async (email, password) => {

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user);

  return { token, user };
};