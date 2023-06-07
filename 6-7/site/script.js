//console.log("map", map)

//map initialization 
var map = L.map('map').setView([51.505, -0.09], 13);

//OSM layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
