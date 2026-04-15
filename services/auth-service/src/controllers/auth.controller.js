import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};