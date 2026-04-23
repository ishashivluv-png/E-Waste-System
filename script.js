const espIP = "http://10.214.127.154"; // SET YOUR ESP32 IP HERE
let users = JSON.parse(localStorage.getItem('ecoUsers')) || {}; 
let currentUser = null;

// 1. Generate QR Code
new QRCode(document.getElementById("qrcode"), window.location.href);

function showLogin() {
    document.getElementById('qr-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

// 2. Auth Logic: Registration and Login
function handleAuth() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const error = document.getElementById('error-msg');

    if (u === "admin" && p === "admin123") {
        showScreen('admin-screen');
        startAdminMonitor();
        return;
    }

    if (users[u]) {
        // User exists, check password
        if (users[u].password === p) {
            currentUser = u;
            showUserScreen();
        } else {
            error.innerText = "Incorrect username/password. This name is already taken.";
        }
    } else {
        // New Registration
        users[u] = { password: p, points: 0 };
        localStorage.setItem('ecoUsers', JSON.stringify(users));
        currentUser = u;
        showUserScreen();
    }
}

function showUserScreen() {
    showScreen('user-screen');
    document.getElementById('user-display').innerText = currentUser;
    updatePointsDisplay();
}

// 3. Disposal and Point Logic
async function dispose(type, pts) {
    try {
        const response = await fetch(`${espIP}/${type}`);
        if(response.ok) {
            users[currentUser].points += pts;
            localStorage.setItem('ecoUsers', JSON.stringify(users));
            updatePointsDisplay();
            alert(`Success! ${pts} points added.`);
        }
    } catch (e) {
        alert("Check Bin Connection!");
    }
}

function updatePointsDisplay() {
    const p = users[currentUser].points;
    document.getElementById('user-points').innerText = p;
    if(p >= 100) document.getElementById('reward-box').classList.remove('hidden');
}

// 4. Admin Logic (85% Alert)
function startAdminMonitor() {
    setInterval(async () => {
        try {
            const res = await fetch(`${espIP}/data`);
            const data = await res.json();
            document.getElementById('temp').innerText = data.t;
            document.getElementById('fill').innerText = data.f;
            document.getElementById('gas').innerText = data.g;
            document.getElementById('dust').innerText = data.d;

            const alertBanner = document.getElementById('bin-alert');
            if (data.f >= 85) alertBanner.classList.remove('hidden');
            else alertBanner.classList.add('hidden');
            
        } catch (e) { console.log("ESP32 Offline"); }
    }, 3000);
}

function showScreen(id) {
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function logout() { location.reload(); }
