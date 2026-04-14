import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payments", paymentRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "payment-service",
    status: "ok"
  });
});

export default app;