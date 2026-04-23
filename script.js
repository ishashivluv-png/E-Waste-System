// REPLACE THIS IP WITH THE ONE FROM SERIAL MONITOR
const espIP = "http://10.214.127.154"; 

// 1. Function to send commands (Rotate Bin)
async function sendCommand(type) {
    const statusText = document.getElementById('status');
    statusText.innerText = "Processing " + type + "... Please wait.";
    
    try {
        const response = await fetch(`${espIP}/${type}`);
        if (response.ok) {
            statusText.innerText = "Bin ready! Insert waste now.";
            document.getElementById('coupon-box').classList.remove('hidden');
        }
    } catch (error) {
        statusText.innerText = "Error: Bin not found on network.";
        console.error(error);
    }
}

// 2. Function to fetch sensor data for Admin Dashboard
async function updateDashboard() {
    try {
        const response = await fetch(`${espIP}/data`);
        const data = await response.json();

        document.getElementById('temp').innerText = data.t;
        document.getElementById('fill').innerText = data.f;
        document.getElementById('gas').innerText = data.g;
        document.getElementById('dust').innerText = Math.round(data.d);

        // Update status if bin is full
        if(data.f >= 85) {
            document.getElementById('status').innerText = "⚠️ BIN FULL - DO NOT USE";
            document.getElementById('status').style.color = "red";
        }
    } catch (error) {
        console.log("Dashboard update failed. Check connection.");
    }
}

// Update dashboard every 3 seconds
setInterval(updateDashboard, 3000);
