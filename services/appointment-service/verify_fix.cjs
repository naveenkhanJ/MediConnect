const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testFix() {
  const doctorId = 16;
  const token = jwt.sign({ id: doctorId, role: 'doctor', email: 'doc16@test.com' }, 'your_secret_key', { expiresIn: '1h' });

  try {
    // Test the doctor-service endpoint
    const res = await axios.get('http://localhost:5009/api/doctor/appointments/pending', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log("SUCCESS! Doctor Service Returned:", res.data.length, "pending appointments.");
    console.log("Data sample:", JSON.stringify(res.data[0], null, 2));
  } catch (err) {
    if (err.response) {
      console.error("FAILED! Status:", err.response.status);
      console.error("Error data:", err.response.data);
    } else {
      console.error("FAILED! Error message:", err.message);
    }
  }
}

testFix();
