const key = '7SGo3nVkTl7JQ90xmJ0i';
const map = L.map('map').setView([40.74860435246981, -73.98388941596163], 14); //starting position
const mtLayer = L.maptilerLayer({
    style: "https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i",
    geolocate: true
}).addTo(map);
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