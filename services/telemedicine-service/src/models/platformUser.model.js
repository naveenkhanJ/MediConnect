import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PlatformUser = sequelize.define(
  "PlatformUser",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "PATIENT", "DOCTOR"),
      allowNull: false,
      defaultValue: "PATIENT",
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "SUSPENDED", "PENDING"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "platform_users",
    timestamps: true,
  }
);

export default PlatformUser;
