import { findAllDoctors } from "./src/models/user.model.js";

async function testQuery() {
    try {
        const docs = await findAllDoctors();
        console.log("Auth Doctors count:", docs.length);
        console.log("Auth Doctors JSON:", JSON.stringify(docs, null, 2));
    } catch(e) {
        console.error("Error query auth DB:", e.message);
    }
}
testQuery();
