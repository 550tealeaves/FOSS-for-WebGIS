//HOW TO CREATE FULLSCREEN MAP FOR MOBILE DEVICES THAT DETECTS USER'S LOCATION 

//INITIALIZE MAP 
var map = L.map('map').fitWorld();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

//SHORTCUT TO ZOOM MAP VIEW TO DETECTED LOCATION - 16 = MAX ZOOM 
map.locate({ setView: true, maxZoom: 16 });

//ADD MARKER IN DETECTED LOCATION BY ADDING EVENT LISTENER TO LOCATIONFOUND EVENT BEFORE locateAndSetView call
function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

//ADD ERROR MSG IF GEOLOCATION FAILS
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);