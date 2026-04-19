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
let totalPoints = 0;

function submitWaste() {
    let item = document.getElementById("item").value;

    let signal = 0;

    if (item === "Battery") {
        signal = 1;
        totalPoints += 10;
    } else if (item === "PCB") {
        signal = 2;
        totalPoints += 20;
    } else if (item === "Mobile Phone") {
        signal = 3;
        totalPoints += 30;
    } else {
        signal = 4;
        totalPoints += 5;
    }

    // Show points
    document.getElementById("points").innerText =
        "⭐ Total Points: " + totalPoints;

    // Show signal (important for demo)
    document.getElementById("reward").innerText =
        "Sent Signal: " + signal;

    console.log("Signal sent to ESP32:", signal);
}
window.onload = function() {
    document.getElementById("login").style.display = "block";
};
