const axios = require('axios');

async function testPatientInternal() {
  const patientId = '2';
  const secret = 'mediconnect-internal';
  const url = `http://localhost:5002/api/patients/internal/${patientId}`;

  try {
    console.log(`[TEST] Fetching patient ${patientId} details with secret...`);
    const res = await axios.get(url, { headers: { 'x-internal-secret': secret } });
    console.log("Response:", JSON.stringify(res.data, null, 2));
    
    if (res.data.email && res.data.contact) {
      console.log("SUCCESS: Patient contact details fetched.");
    } else {
      console.error("FAILED: Missing contact details in response.");
    }
    process.exit(0);
  } catch (err) {
    console.error("TEST FAILED:", err.response?.data || err.message);
    process.exit(1);
  }
}

testPatientInternal();
