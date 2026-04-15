import { getAIResponse } from "../repository/ai.repository.js";

export const analyzeSymptoms = async (symptoms) => {
    const response = await getAIResponse(symptoms);

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    try {
        // Gemini returns text 
        const parsed = JSON.parse(text);

        return parsed;

    } catch (err) {
        return {
            possibleConditions: [],
            severity: "Unknown",
            recommendedSpecialties: ["General Physician"],
            advice: text || "Consult a doctor"
        };
    }
};