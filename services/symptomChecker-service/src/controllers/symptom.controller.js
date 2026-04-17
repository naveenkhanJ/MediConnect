import { analyzeSymptoms } from "../services/ai.service.js";

export const checkSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({ error: "symptoms are required" });
        }

        const result = await analyzeSymptoms(symptoms);

        return res.json({
            success: true,
            data: result,
            disclaimer: "This is not a medical diagnosis. Please consult a doctor."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};