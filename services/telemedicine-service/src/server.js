import app from "./app.js";
import sequelize from "./config/database.js";
import env from "./config/env.js";
import "./models/consultationSession.model.js";
import "./models/platformUser.model.js";
import "./models/doctorVerification.model.js";
import "./models/notificationLog.model.js";
import PlatformUser from "./models/platformUser.model.js";
import DoctorVerification from "./models/doctorVerification.model.js";
import { getLogger } from "./utils/logger.util.js";

const logger = getLogger("server");

const seedDemoAdmin = async () => {
  const email = "admin@mediconnect.local";
  const existing = await PlatformUser.findOne({ where: { email } });
  if (existing) return;
  await PlatformUser.create({
    email,
    fullName: "Platform Admin",
    role: "ADMIN",
    status: "ACTIVE",
  });
  logger.info("Seeded demo admin user:", email);
};

const seedDemoData = async () => {
  const demoUsers = [
    {
      email: "patient@mediconnect.local",
      fullName: "Nimali Perera",
      role: "PATIENT",
      status: "ACTIVE",
    },
    {
      email: "doctor.pending@mediconnect.local",
      fullName: "Dr. Kavindu Silva",
      role: "DOCTOR",
      status: "PENDING",
    },
    {
      email: "doctor.active@mediconnect.local",
      fullName: "Dr. Amanda Fernando",
      role: "DOCTOR",
      status: "ACTIVE",
    },
  ];

  for (const row of demoUsers) {
    const existing = await PlatformUser.findOne({ where: { email: row.email } });
    if (!existing) {
      await PlatformUser.create(row);
    }
  }

  const pendingDoctor = await PlatformUser.findOne({
    where: { email: "doctor.pending@mediconnect.local" },
  });
  const activeDoctor = await PlatformUser.findOne({
    where: { email: "doctor.active@mediconnect.local" },
  });

  const demoVerifications = [
    {
      platformUserId: pendingDoctor?.id ?? null,
      fullName: "Dr. Kavindu Silva",
      licenseNumber: "SLMC-98231",
      specialty: "Cardiology",
      email: "doctor.pending@mediconnect.local",
      status: "PENDING",
      adminNotes: null,
      reviewedAt: null,
    },
    {
      platformUserId: activeDoctor?.id ?? null,
      fullName: "Dr. Amanda Fernando",
      licenseNumber: "SLMC-44110",
      specialty: "Dermatology",
      email: "doctor.active@mediconnect.local",
      status: "APPROVED",
      adminNotes: "License and identity verified.",
      reviewedAt: new Date(),
    },
  ];

  for (const row of demoVerifications) {
    const existing = await DoctorVerification.findOne({
      where: { licenseNumber: row.licenseNumber },
    });
    if (!existing) {
      await DoctorVerification.create(row);
    }
  }
};

const startServer = async () => {
  try {
    logger.info("Starting telemedicine service...");
    logger.info("Database Configuration:", {
      host: env.dbHost,
      port: env.dbPort,
      database: env.dbName,
      user: env.dbUser,
    });

    logger.info("Authenticating database connection...");
    await sequelize.authenticate();
    logger.info("MySQL connected successfully");

    logger.info("Synchronizing database models...", { alter: env.dbSyncAlter });
    await sequelize.sync({ alter: env.dbSyncAlter });
    logger.info("Database synced successfully");

    await seedDemoAdmin();
    await seedDemoData();

    app.listen(env.port, "0.0.0.0", () => {
      logger.info(`Telemedicine service running on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Server startup failed:", error.message);
    logger.error("Stack trace:", error.stack);
    process.exit(1);
  }
};

startServer();