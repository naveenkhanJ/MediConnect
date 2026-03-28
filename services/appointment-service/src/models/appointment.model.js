import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patientId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    doctorId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    timeSlot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    consultationType: {
      type: DataTypes.ENUM("ONLINE", "PHYSICAL"),
      allowNull: false,
      defaultValue: "ONLINE"
    },
    meetingLink: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING_PAYMENT",
        "CONFIRMED",
        "RESCHEDULED",
        "CANCELLED",
        "COMPLETED",
        "PAYMENT_FAILED"
      ),
      allowNull: false,
      defaultValue: "PENDING_PAYMENT"
    }
  },
  {
    tableName: "appointments",
    timestamps: true
  }
);

export default Appointment;