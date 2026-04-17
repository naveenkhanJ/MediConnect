import express from "express";

const app = express();

app.get("/api/patients/:patientId/reports", (req, res) => {
  res.json([
    {
      id: 1,
      report_name: "Blood Test",
      file_url: "http://example.com/report.pdf",
      description: "Routine check",
      created_at: new Date()
    }
  ]);
});

app.listen(5000, () => {
  console.log("Mock Patient Service running on port 5000");
});