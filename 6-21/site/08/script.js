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

//create this layerControl to easily toggle between layers 
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
                case 'A': case 'C': case 'E': return { color: "blue", weight: 5 };
                case 'B': case 'M': case 'D': return { color: "orange", weight: 5 };
                case 'N': case 'Q': case 'R': case 'W': return { color: "yellow", weight: 5 };
                case '1': case '2': case '3': return { color: "red", weight: 5 };
                case 'J': case 'Z': return { color: "brown", weight: 5 };
                case '4': case '5': case '6': return { color: "green", weight: 5 };
                case '7': return { color: "purple", weight: 5 };
                case 'G': return { color: "lightgreen", weight: 5 };
                case 'S': case 'L': return { color: "gray", weight: 5 };
                default: return { color: "black", weight: 5 };


            }
        },
        
        //onEachFeature loops through each feature and performs an action
        //Loops through features and if features.properties and feature.properties.rt_symbol, then the Popup marker will display the result of features.properties.rt_symbol (the name of subway line)
        onEachFeature: function (feature, layer) {
            console.log('subway', feature) //only shows what's in the features
            console.log('subway-layer', layer) //will show the response for the entire layer - features, popups, options etc
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
        fillColor: "yellow",
        color: "crimson",
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
    //to find the lat/lng of the pizza places, 1st console log the response.data
    //console.log("pizza-info", resp.data);

    //map function loops through every feature in array and returns a transformation of the item
    const points = resp.data.features.map(feature => {  //"feature" could be named anything, ex: "f"
        return[feature.geometry.coordinates[1], feature.geometry.coordinates[0]];  //return feature.geometry.coordinates would return lng/lat coords but since [0] = lng coord pos in array & [1] = lat coord pos in array, reverse them to get lat, lng results
    });

    //add a new polyline and include snakingSpeed (speed of which it moves) & then add to map and include snakeIn()
    var line = L.polyline(points, { snakingSpeed: 15, color: "magenta", weight: 6 });
    line.addTo(map).snakeIn();

    console.log("points", points);


    L.geoJSON(resp.data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        
        //onEachFeature loops through each feature and performs an action
        //Loops through features and if features.properties and feature.properties.name, then the Popup marker will display the result of features.properties.name (the pizza store's name)
        onEachFeature: function (feature, layer) { 
            console.log("pizza", feature)
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