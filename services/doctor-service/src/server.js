import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app =  express();
const port = process.env.PORT || 3002;

// SERVER runing
app.listen(port, () => {
    console.log(`Doctor service is running on http:localhost:${port}`);
})