import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 5005,
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: process.env.DB_NAME || "telemedicine_db",
  dbUser: process.env.DB_USER || "root", 
  dbPassword: process.env.DB_PASSWORD || "root",
  jitsiBaseUrl: process.env.JITSI_BASE_URL || "https://meet.jit.si",
  jitsiAppId: process.env.JITSI_APP_ID || "mediconnect",
  jitsiAppSecret: process.env.JITSI_APP_SECRET || null,
  useMockAppointment: process.env.USE_MOCK_APPOINTMENT === "true",
  appointmentServiceUrl:
    process.env.APPOINTMENT_SERVICE_URL || "http://localhost:5001/api",
  notificationServiceUrl:
    process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5006/api/v1",
  rabbitmqUrl: process.env.RABBITMQ_URL || "",
  rabbitmqExchange: process.env.RABBITMQ_EXCHANGE || "mediconnect.events",
  demoPatientEmail: process.env.DEMO_PATIENT_EMAIL || "patient@example.com",
  demoPatientPhone: process.env.DEMO_PATIENT_PHONE || "+94700000000",
  demoDoctorEmail: process.env.DEMO_DOCTOR_EMAIL || "doctor@example.com",
  dbSyncAlter: process.env.DB_SYNC_ALTER !== "false",

};

export default env;