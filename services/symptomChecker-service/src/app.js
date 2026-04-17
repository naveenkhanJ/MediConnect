import "./config/env.js";
import express from "express";
import cors from "cors";

import symptomRoutes from "./routes/symptom.routes.js";



console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/symptoms", symptomRoutes);


app.listen(5005,() => {
    console.log("Ai Symptom Checker running on port 5005");
});