import { getDashboardSummary } from "../services/dashboard.service.js";

export const getDashboardSummaryController = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const summary = await getDashboardSummary(doctorId);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};