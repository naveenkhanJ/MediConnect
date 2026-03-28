import sequelize from "./sequelize.js";

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Appointment DB connected successfully");
  } catch (error) {
    console.error("Appointment DB connection failed:", error.message);
    process.exit(1);
  }
};