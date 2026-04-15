import app from "./app.js";
import env from "./config/env.js";
import { startRabbitConsumer } from "./consumers/rabbitmq.consumer.js";
import sequelize from "./config/sequelize.js";
import "./models/notificationLog.model.js";

async function start() {
  try {
    await sequelize.authenticate();
  } catch (e) {
    if (String(e?.message || "").includes("Unknown database")) {
      // Auto-create DB if missing (same MySQL instance credentials).
      const { Sequelize } = await import("sequelize");
      const bootstrap = new Sequelize("", env.dbUser, env.dbPassword, {
        host: env.dbHost,
        port: env.dbPort,
        dialect: "mysql",
        logging: false,
      });
      await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${env.dbName}\``);
      await bootstrap.close();
      await sequelize.authenticate();
    } else {
      throw e;
    }
  }
  await sequelize.sync({ alter: env.dbSyncAlter });
  app.listen(env.port, "0.0.0.0", () => {
    console.log(`Notification service running on port ${env.port}`);
  });
}

start().catch((e) => {
  console.error("Notification service startup failed:", e.message);
  process.exit(1);
});

// Start async consumer (optional)
startRabbitConsumer({ logger: console }).catch((e) => {
  console.error("RabbitMQ consumer failed:", e.message);
});

