// 1. The IP address from your Arduino Serial Monitor
const esp32_ip = "http://10.41.72.154"; 

let totalPoints = 0;

// Function to move from QR screen to Login
function startSystem() {
    document.getElementById('qr-container').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

// Function to handle Login logic
function login() {
    let user = document.getElementById('username').value;
    let pass = document.getElementById('password').value;

    if (user === "admin" && pass === "123") {
        showPage('adminPage');
        startAdminMonitor(); // Start fetching sensor data
    } else if (user !== "" && pass !== "") {
        document.getElementById('userDisplay').innerText = user;
        showPage('userPage');
    } else {
        alert("Please enter a username and password.");
    }
}

// Helper to switch views
function showPage(pageId) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('main').style.display = 'block';
    document.getElementById('adminPage').style.display = 'none';
    document.getElementById('userPage').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
}

// FUNCTION: Sends waste type to ESP32 and updates points
function submitWaste() {
    let item = document.getElementById('item').value;
    
    // We send the command to the ESP32 (e.g., http://10.41.72.154/battery)
    fetch(`${esp32_ip}/${item.toLowerCase()}`)
    .then(response => {
        if(response.ok) {
            // Point logic based on your UI
            let pts = 0;
            if(item === "Battery") pts = 10;
            else if(item === "PCB") pts = 20;
            else if(item === "Mobile Phone") pts = 30;
            else pts = 5;

            totalPoints += pts;
            document.getElementById('points').innerText = "⭐ Total Points: " + totalPoints;
            alert("Success! " + item + " compartment is opening.");
        }
    })
    .catch(err => {
        alert("Cannot connect to Bin! Check if you are on the same Hotspot.");
        console.error("Connection error:", err);
    });
}

// FUNCTION: Fetches Temp, Gas, and Fill level for Admin
function startAdminMonitor() {
    setInterval(() => {
        fetch(`${esp32_ip}/data`)
        .then(res => res.json())
        .then(data => {
            // Updates the IDs in your Admin Dashboard
            document.getElementById('temp').innerText = data.t; // Temperature
            document.getElementById('gas').innerText = data.g;  // Gas
            document.getElementById('level').innerText = data.f; // Fill %
            
            let alertMsg = document.getElementById('alert');
            if(data.f > 85) {
                alertMsg.innerHTML = "<p style='color:red; font-weight:bold;'>⚠️ ALERT: BIN FULL!</p>";
            } else {
                alertMsg.innerHTML = "";
            }
        })
        .catch(e => console.log("Waiting for ESP32 data..."));
    }, 3000); // Check every 3 seconds
}
