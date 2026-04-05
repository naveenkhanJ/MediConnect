import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/appointments/internal', (req, res) => {
  console.log("📥 Received data from service:");
  console.log(req.body);

  res.json({
    message: "✅ Mock service working",
    data: req.body
  });
});

app.listen(5001, () => {
  console.log("🚀 Mock Appointment Service running on port 5001");
});