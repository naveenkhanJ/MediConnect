import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DOCTOR_SERVICE = "http://localhost:5009";

async function run() {
    try {
        console.log("Fetching profiles from Doctor Service...");
        const resp = await axios.get(`${DOCTOR_SERVICE}/internal/doctors`, {
            headers: { "x-internal-secret": process.env.INTERNAL_SECRET || "mediconnect-internal" }
        });
        console.log("Doctor Profiles Response Type:", Array.isArray(resp.data));
        console.log("Profiles Data:", resp.data);
    } catch(err) {
        console.error("Error fetching profiles:", err.message);
    }
}

run();
