//LAYER GROUPS AND LAYER CONTROLS 
//how to group several layers into 1 and use layers control to switch diff layers

//COMBINE LAYERS INTO A GROUP
var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
    denver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    aurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    golden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');


//CREATE LAYER GROUP (INSTEAD OF ADDING IND LAYERS TO MAP) - CAN ADD/REMOVE FROM MAP AT ONCE 
var cities = L.layerGroup([littleton, denver, aurora, golden]);


//LAYERS CONTROL
//Base layer - mutually exclusive (only 1 layer visible at a time)
//Overlay - the other layers that sit on the base 

//First create the map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

var map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    layers: [osm, cities]
});


//CREATE 2 OBJECTS - BASE & OVERLAYS - SIMPLE KEY-VALUE PAIRS 
//KEY = SETS TEXT FOR LAYER IN CONTROL
//VALUE = REFERENCE TO LAYER

var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT
};

var overlayMaps = {
    "Cities": cities
};

//CREATE LAYERS CONTROL 
//1st argument passed = base layer, 2nd passed = overlay
//Can omit a layer by either only passing in the base layer OR passing in null as 1st and then the overlay
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map); //base layer = 1st argument; overlay = 2nd argument 

//if using multiple base layers, only 1 added to map at initialization - but all added to base layers object when creating layers control

//STYLE KEYS WHEN DEFINING OBJECTS FOR LAYERS 
var baseMaps = {
    "OpenStreetMap": osm,
    "<span style='color: red'>OpenStreetMap.HOT</span>": osmHOT
}; //labels the OSM.hot map red

//ADD/REMOVE BASE LAYERS OR OVERLAYS DYNAMICALLY
var crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.'),
    rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');

var parks = L.layerGroup([crownHill, rubyHill]);
var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
});

layerControl.addBaseLayer(openTopoMap, "OpenTopoMap");
layerControl.addOverlay(parks, "Parks"); //adds parks

