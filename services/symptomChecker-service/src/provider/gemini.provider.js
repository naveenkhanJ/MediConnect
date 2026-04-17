import axios from "axios";
//import { GEMINI_API_KEY } from "../config/env.js";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const callGemini = async (prompt) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing in environment variables");
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            }
        );

        return response.data;

    } catch (error) {
        console.log("GEMINI ERROR:");
        console.log(error.response?.data || error.message);

        throw new Error("AI service failed");
    }
};