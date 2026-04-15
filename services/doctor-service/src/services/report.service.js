import axios from "axios";

const PATIENT_SERVICE_URL = "http://localhost:5000/api/patients";

//fetch all uploaded reports of a patients
export const getPatientReport = async (patientId) =>{
    try{ 
    const res = await axios.get(`${PATIENT_SERVICE_URL}/${patientId}/reports`);

    return res.data.map(report => ({
        id:report.id,
        name:report.report_name,
        url:report.file_url,
        description:report.description,
        uploadedAt:report.created_at
    }));
    }catch (error) {
        console.error("Patient Service Error:", error.response?.status);
        throw new Error("Patient service not reachable");
    }
};