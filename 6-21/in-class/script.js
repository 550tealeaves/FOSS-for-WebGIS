console.log('loaded');

let map = L.map('map').setView([40.7, -73.7], 11);
//L. - means it comes from the Leaflet library 
//make a map object in the div with the ID map 
//setView - sets the starting lat/long and the zoom level
//use geojson.io - to determine lat/lon and zoom level and insert in the setView area (can start wherever you want it to ) - data up there starts at NYC
//bigger zoom number = more zoomed out

//http://maps.stamen.com/#terrain/12/37.7706/-122.3782
const basemap_urls = {
    terrain: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    osm: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
}
//adding different basemaps

L.tileLayer(basemap_urls.terrain, { //will show the terrain layer
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//L.tileLayer - comes directly from Leaflet library
//wants a URL from were to get the tiles 

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


//ADD GEOJSON
//////// Add Subways
///https://leafletjs.com/examples/geojson/
///https://axios-http.com/ - get the script file from here and add to head in html
///Live Server


//1ST WAY TO UPLOAD GEOJSON FILE - LOCAL FILE
// const subways = axios('../site/data/subways.geojson').then(resp => {
//     console.log(resp);
//     L.geoJSON(resp.data, {
//         style: function (feature) { 
//              switch (feature.properties.rt_symbol) {
//             case 'A': case 'C': case 'E': return { color: "blue" };
//             case 'B': case 'M': case 'D': return { color: "orange" };
//             case 'N': case 'Q': case 'R': case 'W': return { color: "yellow" };
//             case '1': case '2': case '3': return { color: "red" };
//             case 'J': case 'Z': return { color: "brown" };
//             case '4': case '5': case '6': return { color: "green" };
//             case '7': return { color: "purple" };
//             case 'G': return { color: "lightgreen" };
//             case 'S': case 'L': return { color: "gray" };
//             default: return { color: "black" };
//            }
//        }
//     }).addTo(map);
// }); //must use ajax to load local files and said files must be managed by a server to load it 
//.then = promise - will wait for the axios request to finish and load the data, then run this function with the response from the file 

//to use a local file downloaded on computer, file must be managed by server in order to load - (1) Use Live Server

//2ND WAY TO UPLOAD GEOJSON FILE - GITHUB LINK
//Can also upload GeoJson using Github - click raw and use the link
axios('https://raw.githubusercontent.com/Willjfield/FOSS-for-WebGIS/main/6-21/site/data/subways.geojson').then(resp => {
    console.log(resp.data)
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
        } //will take each feature and change it based on its properties - adds a certain color based on the letter (like real subway map) - useful for choropleth maps
    }).addTo(map).bringToBack();
})
    

//Add pizza places
//Set Z Index
const pizza = axios('../site/data/pizza.geojson').then(resp => {
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    };

    L.geoJSON(resp.data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map).bringToFront();

});

//Walking area
const walking = axios('../site/data/walk-area.geojson').then(resp => {

    L.geoJSON(resp.data, {
        style: { opacity: 0.95, color: "purple", weight: 2 }
    }).addTo(map).bringToBack();

});