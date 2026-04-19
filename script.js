// GLOBAL DATA - Keeps track of user points in the browser's memory
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
        loadAdminData();
    } else {
        document.getElementById("userPage").style.display = "block";
        document.getElementById("adminPage").style.display = "none";
        document.getElementById("userDisplay").innerText = user;
        
        // Display points for this specific user
        let points = getSavedPoints(user);
        document.getElementById("points").innerText = "⭐ Total Points: " + points;
    }
}

// 3. ADMIN DATA SIMULATION
function loadAdminData() {
    document.getElementById("temp").innerText = "31°C";
    document.getElementById("gas").innerText = "Safe";
    document.getElementById("dust").innerText = "Low";
    document.getElementById("level").innerText = "45% Full";
}

// 4. WASTE SUBMISSION & SERVO LOGIC
function submitWaste() {
    const item = document.getElementById("item").value;
    let pts = 0;
    let targetAngle = 0; 

    // Define Angles for the Servo to drop into specific compartments
    if (item === "Battery") {
        pts = 10;
        targetAngle = 45;
    } else if (item === "PCB") {
        pts = 20;
        targetAngle = 90;
    } else if (item === "Mobile Phone") {
        pts = 30;
        targetAngle = 135;
    } else {
        pts = 5;
        targetAngle = 180;
    }

    // A. Update Points Logic
    let currentTotal = getSavedPoints(currentUser);
    currentTotal += pts;
    savePoints(currentUser, currentTotal);
    
    // B. Update UI
    document.getElementById("points").innerText = "⭐ Total Points: " + currentTotal;
    
    const rewardElement = document.getElementById("reward");
    if (currentTotal >= 100) {
        rewardElement.innerHTML = `
            <div class="coupon-box">
                <p>🎉 Milestone Reached!</p>
                <button onclick="claimCoupon()">Get the coupon & Reset</button>
            </div>`;
    } else {
        rewardElement.innerText = `Sending to ${item} Bin (${targetAngle}°). You earned ${pts} pts!`;
    }

    // C. Send signal to console (Hardware Trigger)
    console.log(`ACTION: Servo move to ${targetAngle} deg, then return to 0 deg.`);
}

// 5. COUPON & RESET
function claimCoupon() {
    alert("Coupon Code: E-WASTE-2026\nPoints for " + currentUser + " will reset.");
    savePoints(currentUser, 0);
    document.getElementById("points").innerText = "⭐ Total Points: 0";
    document.getElementById("reward").innerText = "Points reset successfully!";
}
