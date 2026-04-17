import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const NotificationLog = sequelize.define(
  "NotificationLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    channel: {
      type: DataTypes.ENUM("EMAIL", "SMS"),
      allowNull: false,
    },
    toAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Email address or phone number",
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SENT", "FAILED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    consultationSessionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "notification_logs",
    timestamps: true,
  }
);

export default NotificationLog;
