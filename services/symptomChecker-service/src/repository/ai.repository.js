import { callGemini } from "../provider/gemini.provider.js";

export const getAIResponse = async (symptoms) => {
    const prompt = `
You are a medical assistant.
Analyze these symptoms: ${symptoms}

Return JSON format:
{
  "possibleConditions": [],
  "severity": "",
  "recommendedSpecialties": [],
  "advice": ""
}
`;

    const result = await callGemini(prompt);

    return result;
};