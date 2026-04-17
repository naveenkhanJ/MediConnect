import { getDashboardSummary } from "../services/dashboard.service.js";

export const getDashboardSummaryController = async (req, res) => {
  try {
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const summary = await getDashboardSummary(doctorId);

    res.json(summary);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};