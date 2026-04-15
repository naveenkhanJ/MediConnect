import express from "express";
import cors from "cors";
import appointmentRoutes from "./routes/appointment.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ 
    service: "appointment-service", 
    status: "ok" 
  });
});

export default app;