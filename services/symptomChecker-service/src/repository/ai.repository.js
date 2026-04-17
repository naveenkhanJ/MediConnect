import { callGemini } from "../provider/gemini.provider.js";

export const getAIResponse = async (symptoms) => {
    const prompt = `
You are a medical assistant.
Analyze these symptoms: ${symptoms}

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT use markdown
- Do NOT wrap in triple backticks
- Do NOT add explanations outside JSON

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