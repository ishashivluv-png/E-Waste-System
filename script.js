// GLOBAL VARIABLE - Outside functions so it persists
let totalPoints = 0;

// 1. TRANSITION FROM QR TO LOGIN
function startSystem() {
    document.getElementById("qr-container").style.display = "none";
    document.getElementById("login").style.display = "block";
}

// 2. LOGIN LOGIC
function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user === "" || pass === "") {
        alert("Please enter credentials");
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("main").style.display = "block";

    if (user === "admin" && pass === "1234") {
        showAdmin(user);
    } else {
        showUser(user);
    }
}

function showAdmin(user) {
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
}

// 3. WASTE SUBMISSION LOGIC
function submitWaste() {
    const item = document.getElementById("item").value;
    let signal = 0;
    let pts = 0;

    // Point and Signal mapping
    if (item === "Battery") { signal = 1; pts = 10; }
    else if (item === "PCB") { signal = 2; pts = 20; }
    else if (item === "Mobile Phone") { signal = 3; pts = 30; }
    else { signal = 4; pts = 5; }

    // Increment points
    totalPoints += pts;
    
    // Update UI
    document.getElementById("points").innerText = "⭐ Total Points: " + totalPoints;
    
    const rewardElement = document.getElementById("reward");

    // Check for Coupon Milestone (100 Points)
    if (totalPoints >= 100) {
        rewardElement.innerHTML = `
            <div class="coupon-box">
                <p>🎉 Milestone Reached: 100+ Points!</p>
                <button onclick="claimCoupon()">Get the coupon & Reset</button>
            </div>`;
    } else {
        rewardElement.innerText = "Signal " + signal + " sent! Points earned: " + pts;
    }
    
    console.log("Signal to ESP32: " + signal + " | Current Points: " + totalPoints);
}

// 4. CLAIM AND RESET LOGIC
function claimCoupon() {
    alert("CONGRATULATIONS!\nYour Coupon: E-HERO-2026\n\nPoints will now reset to zero.");
    
    // Reset points
    totalPoints = 0;
    
    // Reset UI
    document.getElementById("points").innerText = "⭐ Total Points: 0";
    document.getElementById("reward").innerText = "Submit waste to start earning points again!";
}
