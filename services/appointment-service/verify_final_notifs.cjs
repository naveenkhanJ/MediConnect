const axios = require('axios');
const { Sequelize } = require('sequelize');

async function testFinalFlow() {
  const appointmentId = 'fdf3387b-2272-4786-ad81-117b53ba03b8'; // Our test appointment
  const doctorId = '16';
  const url = `http://localhost:5009/api/appointments/decision`; // Doctor service handles the trigger

  // We need a token for the doctor
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: doctorId, role: 'doctor' }, 'your_secret_key');

  try {
    console.log("[TEST] Approving appointment to trigger notifications...");
    const res = await axios.patch(`http://localhost:5009/api/doctor/appointments/${appointmentId}/decision`, {
      status: 'ACCEPTED'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Response:", res.data.message);

    console.log("[TEST] Waiting for notifications to process...");
    await new Promise(r => setTimeout(r, 3000));

    // Check Notification Log
    const notifSeq = new Sequelize('postgres://postgres:postgres123@localhost:5432/notification_db');
    const [rows] = await notifSeq.query(`SELECT * FROM notification_logs WHERE "appointmentId" = '${appointmentId}' ORDER BY "createdAt" DESC`);
    
    console.log(`Found ${rows.length} notification logs for this appointment.`);
    rows.forEach(row => {
        console.log(`- Channel: ${row.channel}, To: ${row.toAddress}, Status: ${row.status}`);
    });

    const hasPatientEmail = rows.some(r => r.channel === 'EMAIL' && r.toAddress.includes('@gmail.com') && !r.subject.includes('[Doctor]'));
    const hasDoctorEmail  = rows.some(r => r.channel === 'EMAIL' && r.subject.includes('[Doctor]'));
    const hasAdminWhatsapp = rows.some(r => r.channel === 'WHATSAPP' && r.toAddress === '+94776049950');

    if (hasPatientEmail && hasDoctorEmail && hasAdminWhatsapp) {
        console.log("SUCCESS: All notifications (Patient Email, Doctor Email, Admin WhatsApp) were dispatched correctly!");
    } else {
        console.error("FAILED: Some notifications are missing.");
        if (!hasPatientEmail) console.error("- Missing Patient Email");
        if (!hasDoctorEmail) console.error("- Missing Doctor Email");
        if (!hasAdminWhatsapp) console.error("- Missing Admin WhatsApp");
    }

    process.exit(0);
  } catch (err) {
    console.error("TEST FAILED:", err.response?.data || err.message);
    process.exit(1);
  }
}

testFinalFlow();
