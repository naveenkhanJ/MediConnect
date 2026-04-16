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

    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },

    address: {
      type: DataTypes.TEXT
    },

    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "OTHER")
    },

    birthday: {
      type: DataTypes.DATE
    },

    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },

    speciality: {
      type: DataTypes.STRING,
      allowNull: false
    },

    category: {
      type: DataTypes.STRING // e.g. Specialist, Consultant
    },

    experience: {
      type: DataTypes.INTEGER // years
    },

    consultationType: {
      type: DataTypes.ENUM("PHYSICAL", "ONLINE", "BOTH"),
      allowNull: false
    },

    fees: {
      type: DataTypes.FLOAT
    },

    image: {
      type: DataTypes.STRING // store URL
    },

    bio: {
      type: DataTypes.TEXT
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