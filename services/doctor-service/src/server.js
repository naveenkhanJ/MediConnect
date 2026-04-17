import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import app from "./app.js";
import { connectDB} from "./config/db.js";
import sequelize from "./config/sequelize.js";


dotenv.config();


const PORT = process.env.PORT || 5009;


const startServer = async () => {
    try{
        await connectDB();

        await sequelize.sync({alter:true});

        app.listen(PORT, () => {
         console.log(`Doctor service is running on http:localhost:${PORT}`);
      })
    }catch (error){
        console.error("Server startup faile", error.message);
        process.exit(1);
    }
};

startServer();