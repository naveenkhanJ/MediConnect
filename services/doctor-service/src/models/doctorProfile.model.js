import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Doctor = sequelize.define(
  "Doctor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    speciality: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    consultationType: {
      type: DataTypes.ENUM("PHYSICAL", "ONLINE", "BOTH"),
      allowNull: true,
    },

    fees: {
      type: DataTypes.FLOAT,
    },

    image: {
      type: DataTypes.STRING, // store URL
    },

    bio: {
      type: DataTypes.TEXT,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "doctors",
    timestamps: true,
  },
);

export default Doctor;
