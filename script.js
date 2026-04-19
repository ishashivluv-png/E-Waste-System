let totalPoints = 0;

function submitWaste() {
    let item = document.getElementById("item").value;
    let signal = 0;
    let pts = 0;

    // 1. Assign points based on selection
    if (item === "Battery") { signal = 1; pts = 10; }
    else if (item === "PCB") { signal = 2; pts = 20; }
    else if (item === "Mobile Phone") { signal = 3; pts = 30; }
    else { signal = 4; pts = 5; }

    // 2. Add to total (The += ensures it accumulates)
    totalPoints += pts;
    
    // 3. Update the UI
    document.getElementById("points").innerText = "⭐ Total Points: " + totalPoints;
    
    let rewardElement = document.getElementById("reward");

    // 4. Check if they hit the 100 point milestone
    if (totalPoints >= 100) {
        rewardElement.innerHTML = `
            <div class="coupon-box">
                <p>🎉 Milestone Reached!</p>
                <button onclick="claimCoupon()">Claim Coupon & Reset</button>
            </div>`;
    } else {
        rewardElement.innerText = "Signal " + signal + " sent! Points earned: " + pts;
    }
    
    console.log("ESP32 Signal:", signal, "Total Points:", totalPoints);
}

// NEW FUNCTION: Handles the claim and the reset
function claimCoupon() {
    alert("Your Coupon Code: E-WASTE-HERO-2026\nPoints will now reset.");
    
    // Reset Logic
    totalPoints = 0;
    
    // Update UI back to zero
    document.getElementById("points").innerText = "⭐ Total Points: 0";
    document.getElementById("reward").innerText = "Points reset. Start collecting again!";
}
