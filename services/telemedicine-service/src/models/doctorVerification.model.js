import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const DoctorVerification = sequelize.define(
  "DoctorVerification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    platformUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Linked platform user when doctor has an account",
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "doctor_verifications",
    timestamps: true,
  }
);

export default DoctorVerification;
