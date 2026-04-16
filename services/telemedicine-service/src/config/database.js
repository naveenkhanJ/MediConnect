import { Sequelize } from "sequelize";
import env from "./env.js";
import { getLogger } from "../utils/logger.util.js";

const logger = getLogger("database");

const sequelize = new Sequelize(
  env.dbName,
  env.dbUser,
  String(env.dbPassword),
  {
    host: env.dbHost,
    port: env.dbPort,
    dialect: "postgres",
    logging: (msg) => logger.debug("SQL:", msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Enable auto-commit
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  }
);

export default sequelize;