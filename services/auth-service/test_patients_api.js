import { getAllPatients } from "./src/controllers/admin.controller.js";

const req = {};
const res = {
  json: (data) => {
    console.log("--- API RESPONSE DATA ---");
    console.log(JSON.stringify(data, null, 2));
    console.log("-------------------------");
    process.exit(0);
  },
  status: (code) => ({
    json: (err) => {
      console.error(`Status ${code}:`, err);
      process.exit(1);
    }
  })
};

getAllPatients(req, res);
