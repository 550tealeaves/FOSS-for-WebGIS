console.log('loaded');

let map = L.map('map').setView([40.7, -73.7], 5);
//L. - means it comes from the Leaflet library 
//make a map object in the div with the ID map 
//setView - sets the starting lat/long and the zoom level
//use geojson.io - to determine lat/lon and zoom level and insert in the setView area (can start wherever you want it to ) - data up there starts at NYC
//bigger zoom number = more zoomed in

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


const allStates = axios('usState.json').then(resp => { //brings in the map data 
    console.log('response', resp); //see response in console log

    L.geoJSON(resp.data, { //access the response.data and style it 
        style: {
            opacity: 0.85, //higher the number the more opaque it is
            color: "magenta",
            weight: 2 //higher the number, thicker the lines are 
        } 
    }).addTo(map).bringToFront(); //brought the map to the front so it sits on top

}) //map shows up 

//trying to get the state percentages to show
const statesPct = axios('census_states_pct_nototals.json').then(states => {
    console.log('states', states);

    L.geoJSON(states.data, {
        style: {
             radius: 3, 
             opacity: 0.95, 
             color: "yellow", 
             weight: 4 
            }
    }).addTo(map).bringToFront(); 

})


//trying to get the occupation percentages to show but something isn't working - no console log errors
const categoriesPct = axios('census_cat_pct_nototals.json').then(catPct => {
    console.log('categories', catPct); 

    L.geoJSON(catPct.data[0].MalePop, {
        style: { 
            radius: 6, 
            opacity: 0.95, 
            color: "green", 
            weight: 5 
        }
    }).addTo(map).bringToFront(); 
    
})

const catPctTwo = axios('census_cat_pct.geojson').then(catEdited => {
    console.log('short', catEdited);
})