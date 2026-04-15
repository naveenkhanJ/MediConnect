import sequelize from "./sequelize.js";

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Availablity DB connected successfully");
  } catch (error) {
    console.error("Availability DB connection failed:", error.message);
    process.exit(1);
  }
};