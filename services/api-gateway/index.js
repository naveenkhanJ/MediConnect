import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Service URLs — use env vars in Docker, fall back to localhost for local dev
const PATIENT_SERVICE     = process.env.PATIENT_SERVICE_URL     || 'http://localhost:5000';
const APPOINTMENT_SERVICE = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:5003';
const PAYMENT_SERVICE     = process.env.PAYMENT_SERVICE_URL     || 'http://localhost:5004';

const app = express();
app.use(cors());
app.use(express.json());
// PayHere sends notify as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ─── MOCK LOGIN (used when patient service is not running) ────────────────────
// Remove this route once the patient service is integrated
app.post('/mock/login', (req, res) => {
  res.json({
    token: 'mock-token-123',
    patient: {
      id: 'test-patient-001',
      name: 'Test Patient',
      email: req.body.email || 'test@mediconnect.com'
    }
  });
});

// ─── PATIENT ROUTES ───────────────────────────────────────────────────────────

app.post('/patients/login', async (req, res) => {
  try {
    const response = await axios.post(`${PATIENT_SERVICE}/api/patients/login`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post('/patients/register', async (req, res) => {
  try {
    const response = await axios.post(`${PATIENT_SERVICE}/api/patients/register`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/patients/:id', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE}/api/patients/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.put('/patients/:id', async (req, res) => {
  try {
    const response = await axios.put(`${PATIENT_SERVICE}/api/patients/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.delete('/patients/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${PATIENT_SERVICE}/api/patients/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post('/patients/reports', async (req, res) => {
  try {
    const response = await axios.post(`${PATIENT_SERVICE}/api/patients/reports`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// ─── APPOINTMENT ROUTES ───────────────────────────────────────────────────────

// Search doctors by specialty
// Frontend calls: GET /api/appointments/doctors/search?specialty=Cardiology
app.get('/api/appointments/doctors/search', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE}/api/appointments/doctors/search`, { params: req.query });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Get my appointments (requires auth header forwarding)
// Frontend calls: GET /api/appointments/my/list with x-patient-id header
app.get('/api/appointments/my/list', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE}/api/appointments/my/list`, {
      headers: {
        Authorization: req.headers.authorization,
        'x-patient-id': req.headers['x-patient-id']
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Get appointment status
// Frontend calls: GET /api/appointments/:id/status
app.get('/api/appointments/:id/status', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE}/api/appointments/${req.params.id}/status`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Book appointment (no auth — uses internal route in appointment service)
// Frontend calls: POST /api/appointments
app.post('/api/appointments', async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE}/api/appointments/internal`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Reschedule appointment
// Frontend calls: PUT /api/appointments/:id/reschedule
app.put('/api/appointments/:id/reschedule', async (req, res) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE}/api/appointments/${req.params.id}/reschedule`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Cancel appointment
// Frontend calls: PUT /api/appointments/:id/cancel
app.put('/api/appointments/:id/cancel', async (req, res) => {
  try {
    const response = await axios.put(`${APPOINTMENT_SERVICE}/api/appointments/${req.params.id}/cancel`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// ─── PAYMENT ROUTES ───────────────────────────────────────────────────────────

// Get PayHere form parameters (hash generated server-side)
// Frontend calls: GET /api/payments/payhere-params/:paymentId
app.get('/api/payments/payhere-params/:paymentId', async (req, res) => {
  try {
    const response = await axios.get(`${PAYMENT_SERVICE}/api/payments/payhere-params/${req.params.paymentId}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Get payment by appointment ID
// Frontend calls: GET /api/payments/appointment/:appointmentId
app.get('/api/payments/appointment/:appointmentId', async (req, res) => {
  try {
    const response = await axios.get(`${PAYMENT_SERVICE}/api/payments/appointment/${req.params.appointmentId}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// PayHere notify webhook (PayHere calls this after payment)
// PayHere sends form-urlencoded — forward it as-is
app.post('/api/payments/payhere-notify', async (req, res) => {
  try {
    const params = new URLSearchParams(req.body).toString();
    const response = await axios.post(
      `${PAYMENT_SERVICE}/api/payments/payhere-notify`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || "Error");
  }
});

// Create payment manually
app.post('/api/payments/create', async (req, res) => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE}/api/payments/create`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Mark payment success manually (for testing)
app.put('/api/payments/:id/success', async (req, res) => {
  try {
    const response = await axios.put(`${PAYMENT_SERVICE}/api/payments/${req.params.id}/success`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Mark payment failed manually (for testing)
app.put('/api/payments/:id/fail', async (req, res) => {
  try {
    const response = await axios.put(`${PAYMENT_SERVICE}/api/payments/${req.params.id}/fail`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
