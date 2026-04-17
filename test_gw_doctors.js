import axios from "axios";

async function test() {
    try {
        console.log("Fetching doctors from Gateway...");
        const res = await axios.get("http://localhost:4000/api/admin/doctors", {
            headers: { Authorization: "Bearer ANY_TOKEN" },
            validateStatus: () => true
        });
        console.log("Status:", res.status);
        if (typeof res.data === 'string') {
            console.log("Response starts with:", res.data.substring(0, 50));
        } else {
            console.log("Response:", res.data);
        }
    } catch(e) {
        console.error("Error:", e.message);
    }
}
test();
