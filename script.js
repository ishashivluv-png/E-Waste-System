// Local "Database" (Resets on refresh)
let accounts = { "admin": "admin123" };
let pointsData = {};
let activeUser = "";

function handleAuth() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const err = document.getElementById('error-msg');

    if (!u || !p) { err.innerText = "Fill all fields"; return; }

    // Admin Check
    if (u === "admin") {
        if (p === accounts["admin"]) {
            showView('admin-view');
            startAdminLoop();
        } else { err.innerText = "Incorrect Admin Password"; }
        return;
    }

    // User Check & Registration
    if (accounts[u]) {
        if (accounts[u] === p) {
            activeUser = u;
            loadUser();
        } else {
            err.innerText = "Username taken! Use correct password.";
        }
    } else {
        // Register new
        accounts[u] = p;
        pointsData[u] = 0;
        activeUser = u;
        loadUser();
    }
}

function loadUser() {
    document.getElementById('display-name').innerText = activeUser;
    document.getElementById('points-val').innerText = pointsData[activeUser] || 0;
    showView('user-view');
}

function showView(id) {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('admin-view').classList.add('hidden');
    document.getElementById('user-view').classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
}

function dispose(type) {
    let add = (type === 'battery') ? 30 : (type === 'pcb') ? 25 : 5;
    pointsData[activeUser] += add;
    document.getElementById('points-val').innerText = pointsData[activeUser];

    if (pointsData[activeUser] >= 100) {
        document.getElementById('coupon-area').classList.remove('hidden');
    }

    // Tell ESP32 to move the Stepper and Servo
    fetch('/' + type).then(() => console.log("Bin Rotating..."));
}

function startAdminLoop() {
    setInterval(() => {
        fetch('/data').then(res => res.json()).then(data => {
            document.getElementById('temp-val').innerText = data.t;
            document.getElementById('gas-val').innerText = data.g;
            document.getElementById('fill-val').innerText = data.f;
            
            if (data.f >= 85) {
                document.getElementById('fill-alert').classList.remove('hidden');
            } else {
                document.getElementById('fill-alert').classList.add('hidden');
            }
        });
    }, 3000);
}
