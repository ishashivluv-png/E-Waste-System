// --- HARDWARE CONNECTION ---
// Paste your IP Address from the Serial Monitor between the quotes below
const esp32_ip = "10.153.82.154"; 

// GLOBAL DATA - Keeps track of user points
let currentUser = "";

// Helper: Get points from storage
function getSavedPoints(username) {
    let savedData = localStorage.getItem("ewaste_users");
    let users = savedData ? JSON.parse(savedData) : {};
    return users[username] || 0;
}

// Helper: Save points to storage
function savePoints(username, points) {
    let savedData = localStorage.getItem("ewaste_users");
    let users = savedData ? JSON.parse(savedData) : {};
    users[username] = points;
    localStorage.setItem("ewaste_users", JSON.stringify(users));
}

// 1. SYSTEM START (QR -> LOGIN)
function startSystem() {
    document.getElementById("qr-container").style.display = "none";
    document.getElementById("login").style.display = "block";
}

// 2. LOGIN LOGIC
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
        // Start fetching real data every 3 seconds
        setInterval(loadAdminData, 3000);
    } else {
        document.getElementById("userPage").style.display = "block";
        document.getElementById("adminPage").style.display = "none";
        document.getElementById("userDisplay").innerText = user;
        
        let points = getSavedPoints(user);
        document.getElementById("points").innerText = "⭐ Total Points: " + points;
    }
}

// 3. REAL HARDWARE DATA FETCHING
async function loadAdminData() {
    try {
        const response = await fetch(`http://${esp32_ip}/data`);
        const data = await response.json();

        document.getElementById("temp").innerText = data.temperature + "°C";
        document.getElementById("gas").innerText = data.gas_status;
        document.getElementById("level").innerText = data.bin_level + "% Full";
        document.getElementById("dust").innerText = data.dust_level || "Normal";
    } catch (error) {
        console.log("Hardware not connected yet. Check IP or Wi-Fi.");
    }
}

// 4. WASTE SUBMISSION & PHYSICAL SERVO MOVEMENT
async function submitWaste() {
    const item = document.getElementById("item").value;
    let pts = 0;
    let targetAngle = 0; 

    if (item === "Battery") { pts = 10; targetAngle = 45; }
    else if (item === "PCB") { pts = 20; targetAngle = 90; }
    else if (item === "Mobile Phone") { pts = 30; targetAngle = 135; }
    else { pts = 5; targetAngle = 180; }

    // A. Update Points
    let currentTotal = getSavedPoints(currentUser);
    currentTotal += pts;
    savePoints(currentUser, currentTotal);
    document.getElementById("points").innerText = "⭐ Total Points: " + currentTotal;
    
    // B. TELL THE PHYSICAL SERVO TO MOVE
    try {
        await fetch(`http://${esp32_ip}/servo?angle=${targetAngle}`);
        document.getElementById("reward").innerText = `Sending to ${item} Bin. You earned ${pts} pts!`;
    } catch (error) {
        document.getElementById("reward").innerText = "Waste recorded, but Bin Hardware is Offline.";
    }
}

// 5. COUPON & RESET
function claimCoupon() {
    alert("Coupon Code: E-WASTE-2026\nPoints for " + currentUser + " will reset.");
    savePoints(currentUser, 0);
    document.getElementById("points").innerText = "⭐ Total Points: 0";
    document.getElementById("reward").innerText = "Points reset successfully!";
}
