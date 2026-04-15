import express from "express";
import cors from "cors";
import availabilityRoute from "./routes/availability.routes.js";
import appointmentRoute from "./routes/appointmentStatus.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import reportRoutes from "./routes/report.routes.js";
import profileRoutes from "./routes/doctorProfile.routes.js";
import telemedicineRoutes from "./routes/telemedicine.routes.js";
import getDashboardSummaryRoutes from "./routes/dashboard.route.js";
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
//patient report
app.use("/api/reports",reportRoutes);
//manage profile
app.use("/api/profile",fakeAuth,profileRoutes);
//conduct video session
app.use("/api/telemedicine",telemedicineRoutes);
//dashboard summary
app.use("/api/dashboard",getDashboardSummaryRoutes);


app.get("/doctor", (req, res) => {
  res.status(200).json({ service: "doctor-service", status: "ok" });
});

export default app;