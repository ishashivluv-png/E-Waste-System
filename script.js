// Function to get points from storage or start at 0
function getSavedPoints(username) {
    let savedData = localStorage.getItem("ewaste_users");
    let users = savedData ? JSON.parse(savedData) : {};
    return users[username] || 0;
}

// Function to save points to storage
function savePoints(username, points) {
    let savedData = localStorage.getItem("ewaste_users");
    let users = savedData ? JSON.parse(savedData) : {};
    users[username] = points;
    localStorage.setItem("ewaste_users", JSON.stringify(users));
}

// 1. TRANSITION FROM QR TO LOGIN
function startSystem() {
    document.getElementById("qr-container").style.display = "none";
    document.getElementById("login").style.display = "block";
}

// 2. LOGIN LOGIC
let currentUser = "";

function login() {
    const user = document.getElementById("username").value.trim().toLowerCase();
    const pass = document.getElementById("password").value.trim();

    if (user === "" || pass === "") {
        alert("Please enter credentials");
        return;
    }

    currentUser = user; // Store who is logged in
    document.getElementById("login").style.display = "none";
    document.getElementById("main").style.display = "block";

    if (user === "admin" && pass === "1234") {
        showAdmin();
    } else {
        showUser(user);
    }
}

function showAdmin() {
    document.getElementById("adminPage").style.display = "block";
    document.getElementById("userPage").style.display = "none";
    
    // Simulate sensor data
    document.getElementById("temp").innerText = "31°C";
    document.getElementById("gas").innerText = "Normal";
    document.getElementById("dust").innerText = "Low";
    document.getElementById("level").innerText = "75% Full";
    document.getElementById("alert").innerText = "⚠ Warning: Bin is nearing capacity.";
}

function showUser(user) {
    document.getElementById("userPage").style.display = "block";
    document.getElementById("adminPage").style.display = "none";
    document.getElementById("userDisplay").innerText = user;

    // Load existing points for THIS specific user
    let existingPoints = getSavedPoints(user);
    document.getElementById("points").innerText = "⭐ Total Points: " + existingPoints;
}

// 3. WASTE SUBMISSION LOGIC
function submitWaste() {
    const item = document.getElementById("item").value;
    let pts = 0;

    if (item === "Battery") pts = 10;
    else if (item === "PCB") pts = 20;
    else if (item === "Mobile Phone") pts = 30;
    else pts = 5;

    // Get current total, add new points, and save
    let currentTotal = getSavedPoints(currentUser);
    currentTotal += pts;
    savePoints(currentUser, currentTotal);
    
    // Update UI
    document.getElementById("points").innerText = "⭐ Total Points: " + currentTotal;
    
    const rewardElement = document.getElementById("reward");

    if (currentTotal >= 100) {
        rewardElement.innerHTML = `
            <div class="coupon-box">
                <p>🎉 Milestone Reached: 100+ Points!</p>
                <button onclick="claimCoupon()">Get the coupon & Reset</button>
            </div>`;
    } else {
        rewardElement.innerText = "Points added! You earned " + pts + " extra points.";
    }
}

// 4. CLAIM AND RESET LOGIC
function claimCoupon() {
    alert("CONGRATULATIONS!\nYour Coupon: E-HERO-2026\n\nPoints for " + currentUser + " will reset.");
    
    savePoints(currentUser, 0); // Reset in storage
    
    document.getElementById("points").innerText = "⭐ Total Points: 0";
    document.getElementById("reward").innerText = "Submit waste to start earning points again!";
}
