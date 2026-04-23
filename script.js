// REPLACE WITH YOUR ACTUAL ESP32 IP
const espIP = "http://10.214.127.154"
; 

// Local storage simulates a database of users
let users = JSON.parse(localStorage.getItem('ecoUsers')) || {}; 
let currentUser = null;

// Generate QR Code on the laptop screen
new QRCode(document.getElementById("qrcode"), window.location.href);

function showLogin() {
    document.getElementById('qr-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function handleAuth() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const error = document.getElementById('error-msg');

    if (!u || !p) {
        error.innerText = "Please enter both fields.";
        return;
    }

    // --- ADMIN GATE ---
    if (u === "admin" && p === "admin123") {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-screen').classList.remove('hidden');
        startAdminMonitor(); // Start fetching sensor data
        return;
    }

    // --- USER GATE ---
    if (users[u]) {
        // Check if existing user password matches
        if (users[u].password === p) {
            loginUser(u);
        } else {
            // Error logic for "Username already taken"
            error.innerText = "Incorrect username/password. This name is already registered.";
        }
    } else {
        // Register new user
        users[u] = { password: p, points: 0 };
        localStorage.setItem('ecoUsers', JSON.stringify(users));
        loginUser(u);
    }
}

function loginUser(name) {
    currentUser = name;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('user-screen').classList.remove('hidden');
    document.getElementById('user-display').innerText = currentUser;
    updatePointsDisplay();
}

async function dispose(type, pts) {
    try {
        const response = await fetch(`${espIP}/${type}`);
        if(response.ok) {
            users[currentUser].points += pts;
            localStorage.setItem('ecoUsers', JSON.stringify(users));
            updatePointsDisplay();
            alert(`Bin Rotating for ${type}! +${pts} Points.`);
        }
    } catch (e) {
        alert("Connection Error: Is the ESP32 on?");
    }
}

function updatePointsDisplay() {
    const p = users[currentUser].points;
    document.getElementById('user-points').innerText = p;
    // Show coupon at 100 points
    if(p >= 100) document.getElementById('reward-box').classList.remove('hidden');
}

function startAdminMonitor() {
    setInterval(async () => {
        try {
            const res = await fetch(`${espIP}/data`);
            const data = await res.json();
            document.getElementById('temp').innerText = data.t;
            document.getElementById('fill').innerText = data.f;
            document.getElementById('gas').innerText = data.g;
            document.getElementById('dust').innerText = data.d;

            // Admin Alert Logic for 85% Fill
            const alertBanner = document.getElementById('bin-alert');
            if (data.f >= 85) alertBanner.classList.remove('hidden');
            else alertBanner.classList.add('hidden');
        } catch (e) { console.log("Admin Sync Error"); }
    }, 3000);
}

function logout() { location.reload(); }
