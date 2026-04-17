import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const NotificationLog = sequelize.define(
  "NotificationLog",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    channel: { type: DataTypes.ENUM("EMAIL", "SMS", "WHATSAPP"), allowNull: false },
    toAddress: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM("SENT", "FAILED"), allowNull: false },
    appointmentId: { type: DataTypes.STRING, allowNull: true },
    errorMessage: { type: DataTypes.TEXT, allowNull: true },
    source: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "notification_logs",
    timestamps: true,
  }
);

export default NotificationLog;

