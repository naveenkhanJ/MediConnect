import express from "express";
import cors from "cors";
import availabilityRoute from "./routes/availability.routes.js";
import appointmentRoute from "./routes/appointmentStatus.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import reportRoutes from "./routes/report.routes.js";
import profileRoutes from "./routes/doctorProfile.routes.js";
import telemedicineRoutes from "./routes/telemedicine.routes.js";
import getDashboardSummaryRoutes from "./routes/dashboard.route.js";
import publicDoctorRoutes from "./routes/publicDoctor.routes.js";
import internalDoctorRoutes from "./routes/internalDoctor.routes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
const app = express();

app.use(cors());
app.use(express.json());

// Public doctor catalog routes (no auth)
app.use("/api/doctors", publicDoctorRoutes);

// Internal service-to-service routes (no JWT — uses shared secret)
app.use("/internal/doctors", internalDoctorRoutes);

// Manage profile (Internal auth handling within router)
app.use("/api/profile", profileRoutes);

app.use(authMiddleware);

//availavility
app.use("/api/availability", availabilityRoute);
//reject/accept appointment
app.use("/api/doctor",appointmentRoute);
//issue prescription
app.use("/api/prescriptions",prescriptionRoutes);
//patient report
app.use("/api/reports",reportRoutes);
//conduct video session
app.use("/api/telemedicine",telemedicineRoutes);
//dashboard summary
app.use("/api/dashboard",getDashboardSummaryRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ service: "doctor-service", status: "ok" });
});

app.get("/doctor", (req, res) => {
  res.status(200).json({ service: "doctor-service", status: "ok" });
});

export default app;