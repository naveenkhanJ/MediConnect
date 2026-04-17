import { findAllDoctors } from "./src/models/user.model.js";

async function debug() {
  try {
    const doctors = await findAllDoctors();
    console.log("--- DOCTORS IN AUTH DB ---");
    console.log(JSON.stringify(doctors, null, 2));
    console.log("--------------------------");
    process.exit(0);
  } catch (err) {
    console.error("Error fetching doctors:", err.message);
    process.exit(1);
  }
}

debug();
