import axios from "axios";
import { GEMINI_API_KEY } from "../config/env.js";


console.log("ENV KEY:", process.env.GEMINI_API_KEY);
export const callGemini = async (prompt) => {
    try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }
        );

        return response.data;
    } catch (error) {
        //console.log("GEMINI ERROR FULL:", error.response?.data || error.message);
        //throw new Error("AI service failed");
         console.log("🔥 GEMINI FULL ERROR:");
        console.log(error.response?.data);
        console.log(error.message);

        throw error;
    }
};