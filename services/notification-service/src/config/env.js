import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 5006,

  rabbitmqUrl: process.env.RABBITMQ_URL || "",
  rabbitmqExchange: process.env.RABBITMQ_EXCHANGE || "mediconnect.events",
  rabbitmqQueue: process.env.RABBITMQ_QUEUE || "notification-service.q",
  rabbitmqPrefetch: Number(process.env.RABBITMQ_PREFETCH) || 10,

  // MySQL
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: process.env.DB_NAME || "notification_db",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "root",
  dbSyncAlter: process.env.DB_SYNC_ALTER !== "false",

  // SMTP (email)
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: process.env.SMTP_PORT || "",
  smtpSecure: process.env.SMTP_SECURE || "false",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "",

  // Twilio (SMS)
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioFrom: process.env.TWILIO_FROM || "",
};

export default env;

