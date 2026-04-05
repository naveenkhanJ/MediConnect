import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// Forward GET /patients/:id to Patient Service
app.get('/patients/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/patients/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

//  POST register a new patient
app.post('/patients/register', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/patients/register`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
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

//  DELETE a patient by ID
app.delete('/patients/:id', async (req, res) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/patients/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});



// Forward POST /appointments to Appointment Service
app.post('/appointments', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3002/appointments', req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

// ✅ POST patient reports
app.post('/patients/reports', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/api/patients/reports',req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" }
    );
  }
});

// Start API Gateway
const PORT = 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));