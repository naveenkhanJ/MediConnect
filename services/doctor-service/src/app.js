import express from "express";
import cors from "cors";
import availabilityRoute from "./routes/availability.routes.js";
import appointmentRoute from "./routes/appointmentStatus.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import { fakeAuth } from "./middlewares/fakeAuth.js";
const app = express();

//fake auth
app.use(fakeAuth);

app.use(cors());
app.use(express.json());

//availavility
app.use("/api/availability", availabilityRoute);
//reject/accept appointment
app.use("/api/doctor",appointmentRoute);
//issue prescription
app.use("/api/prescriptions",prescriptionRoutes);

app.get("/doctor", (req, res) => {
  res.status(200).json({ service: "doctor-service", status: "ok" });
});

export default app;