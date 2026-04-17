import { getAIResponse } from "../repository/ai.repository.js";

export const analyzeSymptoms = async (symptoms) => {
    const response = await getAIResponse(symptoms);

    const text =
        response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        return {
            possibleConditions: [],
            severity: "Unknown",
            recommendedSpecialties: ["General Physician"],
            advice: "No response from AI"
        };
    }

    try {
        return JSON.parse(text);
    } catch (err) {
        return {
            possibleConditions: [],
            severity: "Unknown",
            recommendedSpecialties: ["General Physician"],
            advice: text
        };
    }
};