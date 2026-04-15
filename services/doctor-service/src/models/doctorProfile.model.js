import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Doctor = sequelize.define(
  "Doctor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    doctorId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false
    },

    speciality: {
      type: DataTypes.STRING,
      allowNull: false
    },

    consultationType: {
      type: DataTypes.ENUM("PHYSICAL", "ONLINE", "BOTH"),
      allowNull: false
    },

    bio: {
      type: DataTypes.TEXT
    },

    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "doctors",
    timestamps: true
  }
);

export default Doctor;