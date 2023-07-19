//Getting maptiler working - must add the API key
const key = '7SGo3nVkTl7JQ90xmJ0i'; //Professor's API key - can get your own at https://cloud.maptiler.com/account/keys/
const map = L.map('map').setView([40.74860435246981, -73.98388941596163], 14); //starting position (NY)
const mtLayer = L.maptilerLayer({
    //style: "https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key={mapTiler-API-key}", //url to custom map
    style: "https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i", //shows the streets Map
    geolocate: true
}).addTo(map);
//L.control.maptilerGeocoding({ apiKey: key }).addTo(map);
L.control.maptilerGeocoding({ apiKey: key }).addTo(map);

//Alternative is axios('https://raw.githubusercontent.com/Willjfield/FOSS-for-WebGIS/main/6-21/site/data/subways.geojson').then(resp => {})
const subways = axios('subways.geojson').then(resp => {

    L.geoJSON(resp.data, {
        style: function (feature) {
            switch (feature.properties.rt_symbol) {
                case 'A': case 'C': case 'E': return { color: "blue" };
                case 'B': case 'M': case 'D': return { color: "orange" };
                case 'N': case 'Q': case 'R': case 'W': return { color: "yellow" };
                case '1': case '2': case '3': return { color: "red" };
                case 'J': case 'Z': return { color: "brown" };
                case '4': case '5': case '6': return { color: "green" };
                case '7': return { color: "purple" };
                case 'G': return { color: "lightgreen" };
                case 'S': case 'L': return { color: "gray" };
                default: return { color: "black" };


            }
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.rt_symbol) {
                layer.bindPopup(feature.properties.rt_symbol);
            }
        }
    }).addTo(map).bringToBack();
});

//Add pizza places
//Set Z Index
const pizza = axios('pizza.geojson').then(resp => {
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "limegreen",
        color: "gold",
        weight: 3,
        opacity: 1,
        fillOpacity: 1
    };

    L.geoJSON(resp.data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    }).addTo(map).bringToFront();

    console.log(resp.data)

    //f.geometry.coordinates could also be features.geometry.coordinates
    const points = resp.data.features
        .map(f => new L.LatLng(f.geometry.coordinates[1], f.geometry.coordinates[0])); 

    var line = L.polyline(points, { snakingSpeed: 20, color: "magenta", weight: 6 });
    line.addTo(map).snakeIn();

});

//Walking area
const walking = axios('walk-area.geojson').then(resp => {

    L.geoJSON(resp.data, {
        style: { opacity: 0.95, color: "indigo", weight: 2 }
    }).addTo(map).bringToBack();

});