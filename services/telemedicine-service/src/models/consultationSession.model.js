import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { getLogger } from "../utils/logger.util.js";

const logger = getLogger("consultationSession.model");

const ConsultationSession = sequelize.define(
  "ConsultationSession",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    appointmentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    doctorId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    meetingLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jitsiJwt: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JWT token for secure Jitsi access",
    },
    status: {
      type: DataTypes.ENUM("SCHEDULED", "ACTIVE", "COMPLETED", "CANCELLED"),
      allowNull: false,
      defaultValue: "SCHEDULED",
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "consultation_sessions",
    timestamps: true,
    hooks: {
      afterCreate: (session) => {
        logger.info("Consultation session created:", session.toJSON());
      },
      afterUpdate: (session) => {
        logger.info("Consultation session updated:", session.toJSON());
      },
    },
  }
);

export default ConsultationSession;