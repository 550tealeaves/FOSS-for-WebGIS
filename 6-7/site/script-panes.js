//WHAT ARE PANES?
// map panes group layers together implicitly
//grouping lets web browsers work with several layers at once better than w/ layers individually
//Map panes use the z-index CSS property to always show some layers on top of others
//Default order = (1) tile/grid layers, (2) paths (polygons, circles, GeoJSON), (3) marker shadows, (4) marker icons, (5) popups  - can customize order

//(1) CREATE INSTANCE OF L.Map & PANE
var map = L.map('map');
map.createPane('labels');

//(2) SET Z-INDEX OF PANE - getPane() GIVES REFERENCES TO HTMLELEMENT REPRESENTING PANE, CHANGES Z-INDEX
map.getPane('labels').style.zIndex = 650;

//PROBLEM - a problem of having image tiles on top of other map layers = tiles capture clicks/touches. If user clicks anywhere on map, browser assumes she clicked on labels tiles, not on GeoJSON or markers
//(3) solve that w/ pointer-events CSS property
map.getPane('labels').style.pointerEvents = 'none';


//(4) ADD LAYERS USING PANE OPTION ON LABELS TILES
var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB'
}).addTo(map);

var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    pane: 'labels'
}).addTo(map);

var geojson = L.geoJson(GeoJsonData, geoJsonOptions).addTo(map);

//(5) ADD INTERACTION TO EACH FEATURE ON GeoJSON LAYER
geojson.eachLayer(function (layer) {
    layer.bindPopup(layer.feature.properties.name);
});

map.fitBounds(geojson.getBounds());