const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://localhost:5003/api/appointments/doctor/16/pending');
    console.log("Appointment Service Returned: ", res.data.length, " items");
    
    // Check doctor-service endpoint by creating a mock token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 16, role: 'doctor', email: 'doc16@test.com' }, 'mediconnect-secret', { expiresIn: '1h' });
    
    try {
      const res2 = await axios.get('http://localhost:5009/api/doctor/appointments/pending', {
        headers: { Authorization: 'Bearer ' + token }
      });
      console.log("Doctor Service Returned: ", res2.data.length, " items");
    } catch(e) {
      console.error("Doctor Service Error:", e.response?.status, e.response?.data);
    }
    
  } catch (err) {
    console.error(err.message);
  }
}
test();
