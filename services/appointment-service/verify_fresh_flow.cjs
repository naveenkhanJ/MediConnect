const axios = require('axios');
const { Sequelize } = require('sequelize');

async function testFreshFlow() {
  const patientId = '2'; // Valid patient
  const doctorId = '16'; // Valid doctor
  const appointmentServiceUrl = 'http://localhost:5003/api/appointments';
  const doctorServiceUrl = 'http://localhost:5009/api/doctor';

  // 1. Create Appointment
  try {
    console.log("[1/3] Creating fresh appointment...");
    const createRes = await axios.post(`${appointmentServiceUrl}/internal`, {
        patientId,
        doctorId,
        appointmentDate: '2026-04-18',
        timeSlot: '12:00',
        consultationType: 'ONLINE'
    });
    const appointmentId = createRes.data.appointment.id;
    console.log(`Created Appointment: ${appointmentId}`);

    // Manually set status to CONFIRMED (simulating payment)
    const appSeq = new Sequelize('postgres://postgres:postgres123@localhost:5432/appointment_db');
    await appSeq.query(`UPDATE appointments SET status = 'CONFIRMED' WHERE id = '${appointmentId}'`);
    console.log("Status updated to CONFIRMED.");

    // 2. Accept Appointment (Trigger Workflow)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: doctorId, role: 'doctor' }, 'your_secret_key');
    
    console.log("[2/3] Approving appointment...");
    const acceptRes = await axios.patch(`${doctorServiceUrl}/appointments/${appointmentId}/decision`, {
      status: 'ACCEPTED'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Response:", acceptRes.data.message);

    // 3. Verify
    console.log("[3/3] Waiting for notifications...");
    await new Promise(r => setTimeout(r, 5000));

    // Check Logs
    console.log("--- Workflow Logs ---");
    const fs = require('fs');
    if (fs.existsSync('workflow.log')) {
        const logs = fs.readFileSync('workflow.log', 'utf8').split('\n').filter(l => l.includes(appointmentId));
        logs.forEach(l => console.log(l));
    }

    const notifSeq = new Sequelize('postgres://postgres:postgres123@localhost:5432/notification_db');
    const [rows] = await notifSeq.query(`SELECT * FROM notification_logs WHERE "appointmentId" = '${appointmentId}' ORDER BY "createdAt" DESC`);
    
    console.log(`Found ${rows.length} notification logs.`);
    rows.forEach(row => {
        console.log(`- Channel: ${row.channel}, To: ${row.toAddress}, Status: ${row.status}`);
    });

    const hasPatientEmail = rows.some(r => r.channel === 'EMAIL' && r.toAddress === 'pasindu@gmail.com');
    const hasDoctorEmail  = rows.some(r => r.channel === 'EMAIL' && r.toAddress === 'lashan@gmail.com');
    const hasAdminWhatsapp = rows.some(r => r.channel === 'WHATSAPP' && r.toAddress === '+94776049950');

    if (hasPatientEmail && hasDoctorEmail && hasAdminWhatsapp) {
        console.log("SUCCESS: All notifications (Patient Email, Doctor Email, Admin WhatsApp) were dispatched correctly!");
    } else {
        console.error("FAILED: Some notifications are missing.");
    }

    process.exit(0);
  } catch (err) {
    console.error("TEST FAILED:", err.response?.data || err.message);
    process.exit(1);
  }
}

testFreshFlow();
