// --- 1. HARDWARE CONFIGURATION ---
// REPLACE the number below with the IP Address from your Arduino Serial Monitor
const esp32_ip = "10.153.82.154"; 

// GLOBAL DATA - Keeps track of the logged-in user
let currentUser = "";

// --- 2. STORAGE HELPERS (Keep points even after refresh) ---
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
        // FETCH REAL DATA: Start the live update loop (every 3 seconds)
        setInterval(loadAdminData, 3000);
    } else {
        document.getElementById("userPage").style.display = "block";
        document.getElementById("adminPage").style.display = "none";
        document.getElementById("userDisplay").innerText = user;
        
        let points = getSavedPoints(user);
        document.getElementById("points").innerText = "⭐ Total Points: " + points;
    }
}

// --- 4. REAL-TIME DATA (Talking to ESP32 Sensors) ---
async function loadAdminData() {
    try {
        // We add /data to the IP address to get the JSON from ESP32
        const response = await fetch(`http://${esp32_ip}/data`);
        
        if (!response.ok) throw new Error("Hardware unreachable");
        
        const data = await response.json();

        // Update the website UI with real values from the ESP32
        document.getElementById("temp").innerText = data.temperature + "°C";
        document.getElementById("gas").innerText = data.gas_status;
        document.getElementById("level").innerText = data.bin_level + "% Full";
        
        // Optional: Update color based on gas safety
        const gasEl = document.getElementById("gas");
        gasEl.style.color = (data.gas_status === "Safe") ? "#2ecc71" : "#e74c3c";

    } catch (error) {
        console.error("Connection to ESP32 failed:", error);
        // Show "Offline" if the website can't find the bin
        document.getElementById("temp").innerText = "Offline";
        document.getElementById("gas").innerText = "Offline";
        document.getElementById("level").innerText = "---";
    }
}

// --- 5. WASTE SUBMISSION & SERVO CONTROL ---
async function submitWaste() {
    const item = document.getElementById("item").value;
    let pts = 0;
    let targetAngle = 0; 

    // Logic for sorting and angles
    if (item === "Battery") { pts = 10; targetAngle = 45; }
    else if (item === "PCB") { pts = 20; targetAngle = 90; }
    else if (item === "Mobile Phone") { pts = 30; targetAngle = 135; }
    else { pts = 5; targetAngle = 180; }

    // Update User Points
    let currentTotal = getSavedPoints(currentUser);
    currentTotal += pts;
    savePoints(currentUser, currentTotal);
    document.getElementById("points").innerText = "⭐ Total Points: " + currentTotal;
    
    // PHYSICAL ACTION: Tell the ESP32 to move the Servo
    try {
        const response = await fetch(`http://${esp32_ip}/servo?angle=${targetAngle}`);
        if(response.ok) {
            document.getElementById("reward").innerText = `Bin Opening for ${item}... You earned ${pts} pts!`;
        }
    } catch (error) {
        console.warn("Hardware offline, points saved locally.");
        document.getElementById("reward").innerText = "Saved! (Bin hardware is currently disconnected)";
    }
}

// --- 6. REWARDS ---
function claimCoupon() {
    alert("Coupon Code: E-WASTE-2026\nPoints for " + currentUser + " will reset.");
    savePoints(currentUser, 0);
    document.getElementById("points").innerText = "⭐ Total Points: 0";
    document.getElementById("reward").innerText = "Points reset successfully!";
}
