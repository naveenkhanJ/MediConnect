import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import { adminMiddleware } from "./src/middlewares/adminMiddleware.js";
import  dbConfig from "./src/config/db.config.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminMiddleware, adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth Service running on ${PORT}`));



const testDB = async () => {
  try {
    const res = await dbConfig.query("SELECT NOW()");
    console.log("✅ DB Connected:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
};

testDB();