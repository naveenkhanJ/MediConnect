import { analyzeSymptoms } from "../services/ai.service.js";

export const checkSymptoms = async (req, res) =>{
     try{
        const {symptoms} = req.body;

        if(!symptoms){
            return res.status(400).json({error:"symptoms are required"});
            
        }

        const aiResult = await analyzeSymptoms(symptoms);

        res.json({
            ...aiResult,
            disclaimer: "This is not a medical diagnosis.Please consult a doctor"
        });
     }catch(error){
        console.error(error);
        res.status(500).json({error:"AI analysis failed"});
     }
};