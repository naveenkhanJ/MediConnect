import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import symptomRoutes from "./routes/symptom.routes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/symptoms", symptomRoutes);


app.listen(5011,() => {
    console.log("Ai Symptom Checker running on port 5011");
});