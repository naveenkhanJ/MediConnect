import axios from 'axios';

async function run() {
  try {
    console.log("1. Logging in as Admin...");
    const loginResp = await axios.post("http://localhost:4000/auth/login", {
      email: "admin@mediconnect.com",
      password: "admin123"
    });
    
    const token = loginResp.data.token;
    console.log("Token acquired:", token.substring(0, 10) + "...");

    console.log("\n2. Calling Gateway /api/admin/doctors...");
    const docsResp = await axios.get("http://localhost:4000/api/admin/doctors", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Doctors count:", docsResp.data.length);
    console.log("Doctors Sample:", JSON.stringify(docsResp.data[0], null, 2));

    console.log("\n3. Calling Gateway /api/admin/patients...");
    const ptsResp = await axios.get("http://localhost:4000/api/admin/patients", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Patients count:", ptsResp.data.length);

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
  }
}

run();
