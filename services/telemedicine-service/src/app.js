import express from "express";
import cors from "cors";
import telemedicineRoutes from "./routes/telemedicine.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationLogRoutes from "./routes/notificationLog.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Telemedicine service is running",
  });
});

app.use("/api/v1/sessions", telemedicineRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/notifications", notificationLogRoutes);

app.use(errorHandler);

export default app;