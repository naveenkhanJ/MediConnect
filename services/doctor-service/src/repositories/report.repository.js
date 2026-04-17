// repositories/report.repository.js
import { ReportProvider } from "../providers/report.provider.js";

export const getPatientReportsRepo = async (patientId) => {
  return await ReportProvider.getPatientReports(patientId);
};