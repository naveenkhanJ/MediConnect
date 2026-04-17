const axios = require('axios');

async function testConsultationRegistration() {
  const doctorData = {
    name: "Dr. Consultation Test",
    email: `testdoc_${Date.now()}@mediconnect.com`,
    password: "password123",
    role: "doctor",
    phone: "0771234567",
    license_no: "TEST-001",
    fees: 1500,
    speciality: "General physician",
    experience: "10 Years",
    bio: "Testing consultation types",
    consultationType: "BOTH"
  };

  try {
    console.log("[TEST] Registering doctor with BOTH consultation types...");
    const res = await axios.post('http://localhost:4000/auth/register', doctorData);
    console.log("Response:", res.data.message);

    // Verify in doctor_db
    const { Sequelize } = require('sequelize');
    const doctorSeq = new Sequelize('postgres://postgres:postgres123@localhost:5432/doctor_db');
    const [rows] = await doctorSeq.query(`SELECT * FROM "Doctors" WHERE email = '${doctorData.email}'`);
    
    if (rows.length > 0) {
      console.log("SUCCESS! Doctor found in DB.");
      console.log("Consultation Type in DB:", rows[0].consultationType);
      if (rows[0].consultationType === 'BOTH') {
        console.log("VERIFIED: Consultation Type is BOTH.");
      } else {
        console.error("FAILED: Consultation Type is NOT BOTH, it is:", rows[0].consultationType);
      }
    } else {
      console.error("FAILED: Doctor not found in DB.");
    }

    process.exit(0);
  } catch (err) {
    console.error("TEST FAILED:", err.response?.data || err.message);
    process.exit(1);
  }
}

testConsultationRegistration();
