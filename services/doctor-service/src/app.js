import express from "express";
import cors from "cors";
import availabilityRoute from "./routes/availability.routes.js";
import appointmentRoute from "./routes/appointmentStatus.routes.js";
import { fakeAuth } from "./middlewares/fakeAuth.js";
const app = express();

//fake auth
app.use(fakeAuth);

app.use(cors());
app.use(express.json());

app.use("/api/availability", availabilityRoute);
app.use("/api/doctor",appointmentRoute);

app.get("/doctor", (req, res) => {
  res.status(200).json({ service: "doctor-service", status: "ok" });
});

export default app;