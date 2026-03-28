import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import sequelize from "./config/sequelize.js";
import Appointment from "./models/appointment.model.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Appointment Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();