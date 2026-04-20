// --- 1. HARDWARE CONFIGURATION ---
// Update this with the IP from your Serial Monitor
const esp32_ip = "10.153.82.154"; 

let currentUser = "";

// --- 2. STORAGE HELPERS ---
function getSavedPoints(username) {
    let savedData = localStorage.getItem("ewaste_users");
    let users = savedData ? JSON.parse(savedData) : {};
    return users[username] || 0;
}

function savePoints(username, points) {
    let savedData = localStorage.getItem("ewaste_users");
    let users = savedData ? JSON.parse(savedData) : {};
    users[username] = points;
    localStorage.setItem("ewaste_users", JSON.stringify(users));
}

// --- 3. SYSTEM NAVIGATION ---
function startSystem() {
    document.getElementById("qr-container").style.display = "none";
    document.getElementById("login").style.display = "block";
}

function login() {
    const user = document.getElementById("username").value.trim().toLowerCase();
    const pass = document.getElementById("password").value.trim();

    if (user === "" || pass === "") {
        alert("Please enter credentials");
        return;
    }

    currentUser = user; 
    document.getElementById("login").style.display = "none";
    document.getElementById("main").style.display = "block";

    if (user === "admin" && pass === "1234") {
        document.getElementById("adminPage").style.display = "block";
        document.getElementById("userPage").style.display = "none";
        // Start live data updates
        setInterval(loadAdminData, 3000);
    } else {
        document.getElementById("userPage").style.display = "block";
        document.getElementById("adminPage").style.display = "none";
        document.getElementById("userDisplay").innerText = user;
        let points = getSavedPoints(user);
        document.getElementById("points").innerText = "⭐ Total Points: " + points;
    }
}

// --- 4. REAL-TIME DATA (Talking to ESP32) ---
async function loadAdminData() {
    try {
        const response = await fetch(`http://${esp32_ip}/data`);
        if (!response.ok) throw new Error("Offline");
        
        const data = await response.json();

        document.getElementById("temp").innerText = data.temperature + "°C";
        document.getElementById("gas").innerText = data.gas_status;
        document.getElementById("level").innerText = data.bin_level + "% Full";

    } catch (error) {
        console.log("Hardware not reachable...");
        document.getElementById("temp").innerText = "Offline";
        document.getElementById("gas").innerText = "Offline";
        document.getElementById("level").innerText = "---";
    }
}

// --- 5. WASTE SUBMISSION & SERVO ---
async function submitWaste() {
    const item = document.getElementById("item").value;
    let pts = 0;
    let targetAngle = 0; 

    if (item === "Battery") { pts = 10; targetAngle = 45; }
    else if (item === "PCB") { pts = 20; targetAngle = 90; }
    else if (item === "Mobile Phone") { pts = 30; targetAngle = 135; }
    else { pts = 5; targetAngle = 180; }

    let currentTotal = getSavedPoints(currentUser);
    currentTotal += pts;
    savePoints(currentUser, currentTotal);
    document.getElementById("points").innerText = "⭐ Total Points: " + currentTotal;
    
    try {
        // Send command to ESP32
        await fetch(`http://${esp32_ip}/servo?angle=${targetAngle}`);
        document.getElementById("reward").innerText = `Sent to ${item} bin! Earned ${pts} pts.`;
    } catch (error) {
        document.getElementById("reward").innerText = "Points saved! (Hardware Offline)";
    }
}

function claimCoupon() {
    alert("Coupon Code: E-WASTE-2026\nPoints will reset.");
    savePoints(currentUser, 0);
    document.getElementById("points").innerText = "⭐ Total Points: 0";
}
