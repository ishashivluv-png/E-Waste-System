let totalPoints = 0;

function submitWaste() {
    let item = document.getElementById("item").value;
    let signal = 0;
    let pts = 0;

    // Logic for points based on item
    if (item === "Battery") { signal = 1; pts = 10; }
    else if (item === "PCB") { signal = 2; pts = 20; }
    else if (item === "Mobile Phone") { signal = 3; pts = 30; }
    else { signal = 4; pts = 5; }

    totalPoints += pts;
    
    // Update the UI
    document.getElementById("points").innerText = "⭐ Total Points: " + totalPoints;
    
    // Check for the Coupon Milestone
    let rewardElement = document.getElementById("reward");
    
    if (totalPoints >= 100) {
        rewardElement.innerHTML = "<div class='coupon-box'>🎉 Get the coupon! <br> Code: GREEN100</div>";
        rewardElement.style.color = "#2e7d32";
    } else {
        rewardElement.innerText = "Signal " + signal + " sent! You earned " + pts + " points.";
        rewardElement.style.color = "#555";
    }
    
    console.log("ESP32 Signal:", signal);
}
