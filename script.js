let totalPoints = 0;

function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    document.getElementById("login").style.display = "none";
    document.getElementById("main").style.display = "block";

    if (user === "admin" && pass === "1234") {

        document.getElementById("adminPage").style.display = "block";
        document.getElementById("userPage").style.display = "none";

        // Dummy sensor values
        document.getElementById("temp").innerText = "30°C";
        document.getElementById("gas").innerText = "Normal";
        document.getElementById("dust").innerText = "Low";
        document.getElementById("level").innerText = "80% Full";

        document.getElementById("alert").innerText =
            "⚠ Bin almost full!";

    } else {

        document.getElementById("userPage").style.display = "block";
        document.getElementById("adminPage").style.display = "none";

        document.getElementById("userDisplay").innerText = user;
    }
}
function submitWaste() {
    let item = document.getElementById("item").value;
    let sendValue = "";

if (item === "Battery") sendValue = "1";
else if (item === "PCB") sendValue = "2";
else if (item === "Mobile Phone") sendValue = "3";
else sendValue = "4";

console.log("Send to ESP32:", sendValue);

    let points = 0;

    if (item === "Mobile Phone") points = 50;
else if (item === "PCB") points = 40;
else if (item === "Battery") points = 30;
else points = 10;
    totalPoints += points;

    document.getElementById("points").innerText =
        "Total Points: " + totalPoints;

    if (totalPoints >= 100) {
        document.getElementById("reward").innerText =
        "🎉 Congrats! You unlocked Gold Reward!";
    }
}
function logout() {
    location.reload();
}
function showLogin() {
    document.getElementById("qrPage").style.display = "none";
    document.getElementById("login").style.display = "block";
}