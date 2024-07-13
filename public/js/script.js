const socket = io();
const form = document.getElementById('form');
let map;
const markers = {};
let mapReady = false;

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log('Emitting location:', latitude, longitude);
        socket.emit('send-location', { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

console.log("Hii");

document.addEventListener("DOMContentLoaded", function() {
    map = L.map("map").setView([0, 0], 10);

    // Adding a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Suryamani Patra Presenting'
    }).addTo(map);

    mapReady = true; // Set mapReady to true when the map is initialized
});

socket.on("received-location", (data) => {
    const { latitude, longitude, id } = data;
    console.log('Received location:', latitude, longitude, 'for id:', id);
    
    if (!mapReady) {
        console.log('Map not ready');
        return;  // Ensure the map is initialized
    }
    
    if (latitude !== undefined && longitude !== undefined) {
        map.setView([latitude, longitude], 30);
        if (markers[id]) {
            markers[id].setLatLng([latitude, longitude]);
        } else {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
    } else {
        console.error('Invalid location data received:', data);
    }
});

socket.on("user-disconnected",(id) =>{
    console.log("User disconnected: ", id);
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
