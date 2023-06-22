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

//ADD A MARKER
const cunyGC = L.marker([40.74852647353538, -73.98364463562413]).addTo(map); //will add CUNY lat/lon as a marker to the map
const macys = L.marker([40.750831692175524, -73.98912308794618]).addTo(map);

//ADD A POPUP
cunyGC.bindPopup("<b>This is CUNY GC</b>.").openPopup();
macys.bindPopup("<b>Macy's flagship store.</b>").openPopup();

//ADD DYNAMIC MESSAGE
const message = "hello Earthlings"; //this message will show
cunyGC.bindPopup(`<b>CUNY GC</b> ${message}`); //use backticks to concatenate strings
//macys.bindPopup(`<b>${message} from Macy's</b>`);

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
    }).addTo(map);
})
    