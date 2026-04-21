// Function to update sensor data every 3 seconds
setInterval(function() {
    fetch('/data')
    .then(response => response.json())
    .then(data => {
        document.getElementById('temp').innerText = data.temperature + " °C";
        document.getElementById('gas').innerText = data.gas;
        document.getElementById('fill').innerText = data.fill + " %";
        
        // Safety Alert color change
        if(data.gas > 1500) {
            document.getElementById('gas').style.color = "red";
        }
    });
}, 3000);

// Function to send rotation command
function sendDisposal(type) {
    const log = document.getElementById('log');
    log.innerText = "Rotating base to " + type.toUpperCase() + "...";
    
    fetch('/' + type)
    .then(response => {
        if(response.ok) {
            log.innerText = "Item Accepted! Thank you for recycling.";
            setTimeout(() => { log.innerText = "System Ready."; }, 5000);
        }
    });
}
