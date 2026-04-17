import axios from "axios";

// Copy the valid token if we can get it, or we bypass. 
// But let's just make a direct call to auth service first!
async function run() {
    try {
        console.log("Calling Auth Service directly at /api/admin/doctors");
        // We can't do this without a token, so we'll just test if we get JSON or HTML.
        const res = await axios.get("http://localhost:5000/api/admin/doctors", {
            headers: { Authorization: "Bearer INVALID" },
            validateStatus: () => true
        });
        console.log(`Auth Service returned ${res.status}:`, res.data);
        
        console.log("Calling API Gateway at /api/admin/doctors");
        const res2 = await axios.get("http://localhost:4000/api/admin/doctors", {
            headers: { Authorization: "Bearer INVALID" },
            validateStatus: () => true
        });
        console.log(`Gateway returned ${res2.status}:`, res2.data);
        
        console.log("Calling API Gateway at /api/admin/patients");
        const res3 = await axios.get("http://localhost:4000/api/admin/patients", {
            headers: { Authorization: "Bearer INVALID" },
            validateStatus: () => true
        });
        console.log(`Gateway Patient returned ${res3.status}:`, typeof res3.data === 'string' ? res3.data.substring(0, 50) : res3.data);

    } catch(err) {
        console.error(err.message);
    }
}
run();
