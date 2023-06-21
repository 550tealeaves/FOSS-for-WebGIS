console.log('loaded');

let map = L.map('map').setView([40.7, -73.7], 11);
//L. - means it comes from the Leaflet library 
//make a map object in the div with the ID map 
//setView - sets the starting lat/long and the zoom level
//use geojson.io - to determine lat/lon and zoom level and insert in the setView area (can start wherever you want it to ) - data up there starts at NYC
//bigger zoom number = more zoomed out

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//L.tileLayer - comes directly from Leaflet library
//wants a URL from were to get the tiles 

//ADD A MARKER
const marker = L.marker([40.7, -73.983]).addTo(map); //will add CUNY lat/lon as a marker to the map

//ADD A POPUP
marker.bindPopup("<b>This is CUNY GC</b>.").openPopup();

//ADD DYNAMIC MESSAGE
const message = "hello Earthlings"; //this message will show
marker.bindPopup(`<b>CUNY GC</b> ${message}`); //use backticks to concatenate strings

//ADD GEOJSON
//////// Add Subways
///https://leafletjs.com/examples/geojson/
///https://axios-http.com/ - get the script file from here and add to head in html
///Live Server

const subways = axios('../site/data/subways.geojson').then(resp => {
    console.log(resp);
    L.geoJSON(resp.data, {
        style: { color: "#ff0000" }
    }).addTo(map);
}); //must use ajax to load local files and said files must be managed by a server to load it 
//.then = promise - will wait for the axios request to finish and load the data, then run this function with the response from the file 

//to use a local file downloaded on computer, file must be managed by server in order to load - (1) Use Live Server
