let map = L.map('map').setView([40.7, -73.9], 11);

//http://maps.stamen.com/#terrain/12/37.7706/-122.3782
//Layer Controls - will create terrain and osm layer using L.tileLayer
const baseLayers = {
    terrain: L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    osm: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
}

baseLayers['terrain'].addTo(map);
baseLayers['osm'].addTo(map);

const layerControl = L.control.layers(baseLayers).addTo(map);


//ADD MARKERS
const cunyGC = L.marker([40.74852647353538, -73.98364463562413]).addTo(map); //will add CUNY lat/lon as a marker to the map
const macys = L.marker([40.750831692175524, -73.98912308794618]).addTo(map); //adds marker for Macy's
const bryantPark = L.marker([40.753770806752044, -73.98355177128387]).addTo(map); //adds marker for BP
const castleWilliams = L.marker([40.69290300122759, -74.01902168181884]).addTo(map);
const bbg = L.marker([40.67037291567229, -73.9638757889119]).addTo(map);
const cloisters = L.marker([40.86482102080569, -73.93177033801098]).addTo(map);
const vanCortlandt = L.marker([40.89724126054995, -73.8867219336929]).addTo(map);
const bronxZoo = L.marker([40.84963116804752, -73.87661945118136]).addTo(map);
const jfk = L.marker([40.64669826769352, -73.78483097720601]).addTo(map);
const hss = L.marker([40.76517181052674, -73.95265567704324]).addTo(map);

//ADD POPUPS FOR MARKERS
cunyGC.bindPopup("<b>This is CUNY GC</b>.").openPopup();
macys.bindPopup("<b>Macy's flagship store.</b>").openPopup();
bryantPark.bindPopup("<b>Bryant Park is slice of nature surrounded by skyscrapers</b>").openPopup();
castleWilliams.bindPopup("<b>Castle Williams was a prison on Governor's Island</b>")
bbg.bindPopup("<b>The Bk Botanical Garden is beautiful</b>")
cloisters.bindPopup("<b>MET cloisters has religious art</b>")
vanCortlandt.bindPopup("<b>Van Cortlandt Park is bigger than Central Park but much less famous</b>")
bronxZoo.bindPopup("<b>Bronx Zoo is probably the best place to take kids</b>")
jfk.bindPopup("<b>JFK is one of the busiest airports in the world</b>")
hss.bindPopup("<b>HSS specializes in orthopedic care</b>")


//ADD DYNAMIC MESSAGE - popups above don't work when these are active
const message = "hello Earthlings"; //this message will show
cunyGC.bindPopup(`<b>CUNY GC</b> ${message}`); //use backticks to concatenate strings
macys.bindPopup(`<b>${message} from Macy's</b>`);



//Style subways
const subways = axios('../data/subways.geojson').then(resp => {

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
const pizza = axios('../data/pizza.geojson').then(resp => {
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "magenta",
        color: "skyblue",
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

});

//Walking area
const walking = axios('../data/walk-area.geojson').then(resp => {

    L.geoJSON(resp.data, {
        style: { opacity: 0.95, color: "limegreen", weight: 2 }
    }).addTo(map).bringToBack();

});