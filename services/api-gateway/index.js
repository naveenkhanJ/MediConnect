import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Start API Gateway
const PORT = 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));

//login

app.post('/auth/login', async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/login', 
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

//register 
app.post('/auth/register', async (req, res) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/register',
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

//get peteint by id
app.get('/patients/:id', async (req, res) => {
  console.log("AUTH HEADER FROM CLIENT:", req.headers.authorization);
  try {
    const response = await axios.get(
      `http://localhost:5000/api/patients/${req.params.id}`,
           {
        headers: {
          Authorization: req.headers.authorization 
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});




//  PUT update a patient by ID
app.put('/patients/:id', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/patients/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.delete('/patients/:id', async (req, res) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/patients/${req.params.id}`,
      {
        headers: {
          Authorization: req.headers.authorization // 🔥 REQUIRED
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

app.post('/patients/reports', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/patients/reports`, req.body);
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
    const response = await axios.get(`http://localhost:5003/api/appointments/doctors/search`, { params: req.query });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Get my appointments (requires auth header forwarding)
// Frontend calls: GET /api/appointments/my/list
app.get('/api/appointments/my/list', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5003/api/appointments/my/list`, {
      headers: { Authorization: req.headers.authorization }
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
    const response = await axios.get(`http://localhost:5003/api/appointments/${req.params.id}/status`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Book appointment (no auth — uses internal route in appointment service)
// Frontend calls: POST /api/appointments
app.post('/api/appointments', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:5003/api/appointments/internal`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Reschedule appointment
// Frontend calls: PUT /api/appointments/:id/reschedule
app.put('/api/appointments/:id/reschedule', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:5003/api/appointments/${req.params.id}/reschedule`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Cancel appointment
// Frontend calls: PUT /api/appointments/:id/cancel
app.put('/api/appointments/:id/cancel', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:5003/api/appointments/${req.params.id}/cancel`, req.body);
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
    const response = await axios.get(`http://localhost:5004/api/payments/payhere-params/${req.params.paymentId}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Get payment by appointment ID
// Frontend calls: GET /api/payments/appointment/:appointmentId
app.get('/api/payments/appointment/:appointmentId', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5004/api/payments/appointment/${req.params.appointmentId}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// PayHere notify webhook (PayHere calls this after payment)
// PayHere calls: POST /api/payments/payhere-notify
app.post('/api/payments/payhere-notify', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:5004/api/payments/payhere-notify`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Create payment manually
app.post('/api/payments/create', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:5004/api/payments/create`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Mark payment success manually (for testing)
app.put('/api/payments/:id/success', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:5004/api/payments/${req.params.id}/success`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// Mark payment failed manually (for testing)
app.put('/api/payments/:id/fail', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:5004/api/payments/${req.params.id}/fail`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

//_______________________doctor routes ______________________

const DOCTOR_SERVICE_URL = "http://localhost:5009"; 

// Create doctor profile
// Frontend calls:POST /api/profile
app.post("/api/profile", async (req, res) => {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_URL}/api/profile`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Get logged-in doctor profile

// Frontend calls:GET /api/profile/me
app.get("/api/profile/me", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/profile/me`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Update profile

// Frontend calls:PUT /api/profile/me
app.put("/api/profile/me", async (req, res) => {
  try {
    const response = await axios.put(
      `${DOCTOR_SERVICE_URL}/api/profile/me`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Get pending appointments (doctor side))
// Frontend calls: GET /api/doctor/appointments/pending
app.get("/api/doctor/appointments/pending", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/doctor/appointments/pending`
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Approve / Reject appointment(doctor side))
// Frontend calls: PATCH /api/doctor/appointments/:appointmentId/decision
app.patch("/api/doctor/appointments/:appointmentId/decision", async (req, res) => {
  try {
    const response = await axios.patch(
      `${DOCTOR_SERVICE_URL}/api/doctor/appointments/${req.params.appointmentId}/decision`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Get all availability slots
//Frontend calls: GET /api/availability
app.get("/api/availability", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/availability`
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Add availability slot
//Frontend calls: POST /api/availability
app.post("/api/availability", async (req, res) => {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_URL}/api/availability`,
      req.body
    );

    res.status(201).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Update availability slot
//Frontend calls: PUT /api/availability/:id
app.put("/api/availability/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${DOCTOR_SERVICE_URL}/api/availability/${req.params.id}`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Delete availability slot
//Frontend calls: DELETE /api/availability/:id
app.delete("/api/availability/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${DOCTOR_SERVICE_URL}/api/availability/${req.params.id}`
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

//GET DASHBOARD SUMMARY
//Frontend calls: GET /api/dashboard/summary

app.get("/api/dashboard/summary", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/dashboard/summary`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});


// Create prescription
//Frontend calls:POST  /api/prescriptions
app.post("/api/prescriptions", async (req, res) => {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_URL}/api/prescriptions`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    res.status(201).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Get doctor prescriptions
//Frontend calls:GET  /api/prescriptions
app.get("/api/prescriptions", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/prescriptions`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Get patient prescriptions
//Frontend calls:GET  /api/prescriptions/patient/:patientId
app.get("/api/prescriptions/patient/:patientId", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/prescriptions/patient/${req.params.patientId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Download prescription PDF
//Frontend calls:GET /api/prescriptions/:id/pdf
app.get("/api/prescriptions/:id/pdf", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/prescriptions/${req.params.id}/pdf`,
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=prescription-${req.params.id}.pdf`
    );

    res.send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Get patient reports (doctor viewing during consultation)
//Frontend calls: GET /api/doctors/patients/:patientId/reports
app.get("/api/doctors/patients/:patientId/reports", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5002/api/reports/patients/${req.params.patientId}`,
      {
        headers: {
          Authorization: req.headers.authorization || ""
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});
// Create session
//Frontend calls: POST  /api/telemedicine
app.post("/api/telemedicine", async (req, res) => {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_URL}/api/telemedicine`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization || ""
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Join session
//Frontend calls: POST /api/telemedicine/:id/join
app.post("/api/telemedicine/:id/join", async (req, res) => {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_URL}/api/telemedicine/${req.params.id}/join`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization || ""
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Start session
//Frontend calls: PATCH /api/telemedicine/:id/start
app.patch("/api/telemedicine/:id/start", async (req, res) => {
  try {
    const response = await axios.patch(
      `${DOCTOR_SERVICE_URL}/api/telemedicine/${req.params.id}/start`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization || ""
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// End session
//Frontend calls: PATCH /api/telemedicine/:id/end
app.patch("/api/telemedicine/:id/end", async (req, res) => {
  try {
    const response = await axios.patch(
      `${DOCTOR_SERVICE_URL}/api/telemedicine/${req.params.id}/end`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization || ""
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

// Get session by appointment
//Frontend calls: GET /api/telemedicine/appointment/:appointmentId
app.get("/api/telemedicine/appointment/:appointmentId", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/telemedicine/appointment/${req.params.appointmentId}`,
      {
        headers: {
          Authorization: req.headers.authorization || ""
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "Server Error" }
    );
  }
});

//_____________________________AI SYMPTOM CHECKER_________________

const AI_SERVICE_URL = "http://localhost:5005";

// Check symptoms (AI analysis)

//Frontend calls: POST /api/symptoms/check
app.post("/api/symptoms/check", async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/symptoms/check`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization || ""
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { error: "Server Error" }
    );
  }
});
// ─── START SERVER ─────────────────────────────────────────────────────────────
// app.listen must always be at the end, after all routes are registered


