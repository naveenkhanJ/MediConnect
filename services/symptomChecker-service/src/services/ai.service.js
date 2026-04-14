import axios from "axios";
import 'dotenv/config';

const HUGGINGFACE_TOKEN =process.env.HUGGINGFACE_TOKEN;
   

export const analyzeSymptoms = async (symptoms) => {
    try{

         const resp = await axios.post(
            "https://api-inference.huggingface.co/models/gpt2",
           
            {inputs:`Patient symptoms: ${symptoms}.Give general advice`},
            {
                headers:{
                    Authorization:`Bearer ${HUGGINGFACE_TOKEN}`
                }
            }
            
         );
         return {
             
            possibleConditions: ["Example condition"],  
            severity: "Low",                             
            recommendedSpecialties: ["General Physician"], 
            advice: resp.data[0]?.generated_text || "Consult a doctor"
         };
    }catch(err){
        console.error("Hugging Face API error:", err.message);
        return{
            possibleConditions: [],
            severity: "Low",
            recommendedSpecialties: ["General Physician"],
            advice: "Could not generate advice. Consult a doctor."
        }
    }
   
    

};