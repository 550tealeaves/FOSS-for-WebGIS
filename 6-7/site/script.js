//console.log("map", map)

//MAP INITIALIZATION 
var map = L.map('map').setView([51.505, -0.09], 13);

//OSM LAYER
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//ADD A MARKER  
var marker = L.marker([51.5, -0.09]).addTo(map);

//ADD A CIRCLE - CUSTOMIZE IT WITH OPTIONS
var circle = L.circle([51.508, -0.11], {
    color: 'yellow',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

//ADD A POLYGON
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//ADD A POPUP - popups used to attach info to a particular object on a map
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup(); //adds text to marker variable
circle.bindPopup("I am a circle."); //adds text to circle variable
polygon.bindPopup("I am a polygon."); //adds text to polygon variable 


//POPUPS CAN BE LAYERS - FOR ATTACHING MORE THAN A POPUP TO AN OBJECT
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);


//EVENTS - LET YOU REACT TO USER INTERACTION 
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng); 
} //click the map and it will display this alert

map.on('click', onMapClick); //function activates on a click on the map


//CHANGE EVENT TO POPUP INSTEAD OF ALERT
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
} //when you click the map, it will popup with the .setContent statement

map.on('click', onMapClick);
