
import axios from "axios";

const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL;

export const ReportProvider = {

  getPatientReports: async (patientId) => {
    const res = await axios.get(
      `${PATIENT_SERVICE_URL}/api/patients/${patientId}/reports`
    );

    return res.data.map(report => ({
      id: report.id,
      name: report.report_name,
      url: report.file_url,
      description: report.description,
      uploadedAt: report.created_at
    }));
  }

};