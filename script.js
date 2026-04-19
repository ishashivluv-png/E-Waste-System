let totalPoints = 0;

// Function to move from QR screen to Login
function startSystem() {
    document.getElementById("qr-container").style.display = "none";
    document.getElementById("login").style.display = "block";
}

// LOGIN LOGIC
function login() {
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("password").value.trim();

    if (user === "" || pass === "") {
        alert("Please enter credentials");
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("main").style.display = "block";

    if (user === "admin" && pass === "1234") {
        // Show Admin UI
        document.getElementById("adminPage").style.display = "block";
        document.getElementById("userPage").style.display = "none";

        // Simulated Data
        document.getElementById("temp").innerText = "28°C";
        document.getElementById("gas").innerText = "Safe";
        document.getElementById("dust").innerText = "Low";
        document.getElementById("level").innerText = "45% Full";
        document.getElementById("alert").innerText = "System Operating Normally";
        document.getElementById("alert").style.color = "green";

    } else {
        // Show User UI
        document.getElementById("userPage").style.display = "block";
        document.getElementById("adminPage").style.display = "none";
        document.getElementById("userDisplay").innerText = user;
    }
}

// WASTE SUBMIT LOGIC
function submitWaste() {
    let item = document.getElementById("item").value;
    let signal = 0;
    let pts = 0;

    if (item === "Battery") { signal = 1; pts = 10; }
    else if (item === "PCB") { signal = 2; pts = 20; }
    else if (item === "Mobile Phone") { signal = 3; pts = 30; }
    else { signal = 4; pts = 5; }

    totalPoints += pts;

    document.getElementById("points").innerText = "⭐ Total Points: " + totalPoints;
    document.getElementById("reward").innerText = "Signal " + signal + " sent! You earned " + pts + " points.";
    
    console.log("ESP32 Signal:", signal);
}
