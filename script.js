let totalPoints = 0;

function startSystem() {
    document.getElementById('qr-container').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

function login() {
    let user = document.getElementById('username').value;
    let pass = document.getElementById('password').value;

    if (user === "admin" && pass === "123") {
        showPage('adminPage');
        startAdminMonitor();
    } else if (user !== "" && pass !== "") {
        document.getElementById('userDisplay').innerText = user;
        showPage('userPage');
    } else {
        document.getElementById('login-error').innerText = "Please enter valid credentials";
    }
}

function showPage(pageId) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('main').style.display = 'block';
    document.getElementById('adminPage').style.display = 'none';
    document.getElementById('userPage').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
}

function submitWaste() {
    let item = document.getElementById('item').value;
    
    // API CALL TO ESP32
    fetch('/' + item)
    .then(response => {
        if(response.ok) {
            let pts = (item === "battery") ? 10 : (item === "pcb") ? 20 : (item === "mobile") ? 30 : 5;
            totalPoints += pts;
            document.getElementById('points').innerText = "⭐ Total Points: " + totalPoints;
            alert("Waste processed! Compartment opened.");
        }
    })
    .catch(err => alert("Connection to Bin failed!"));
}

function startAdminMonitor() {
    setInterval(() => {
        fetch('/data')
        .then(res => res.json())
        .then(data => {
            document.getElementById('temp').innerText = data.t;
            document.getElementById('gas').innerText = data.g;
            document.getElementById('level').innerText = data.f;
            
            if(data.f > 85) {
                document.getElementById('alert').innerHTML = "<p style='color:red;'>⚠️ WARNING: BIN FULL!</p>";
            }
        });
    }, 3000);
}
