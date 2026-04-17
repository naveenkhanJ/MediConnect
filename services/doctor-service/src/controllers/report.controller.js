// controllers/report.controller.js
import { getPatientReportsService } from "../services/report.service.js";

export const fetchPatientReport = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { appointmentId } = req.params;

    const reports = await getPatientReportsService({
      appointmentId,
      doctorId
    });

    res.status(200).json(reports);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};