import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    appointmentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patientId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "LKR"
    },
    gateway: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PAYHERE"
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED", "REFUNDED"),
      allowNull: false,
      defaultValue: "PENDING"
    }
  },
  {
    tableName: "payments",
    timestamps: true
  }
);

export default Payment;