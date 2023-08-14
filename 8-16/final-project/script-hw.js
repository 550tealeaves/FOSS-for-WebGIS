console.log('loaded');

let map = L.map('map').setView([40.7, -73.7], 5);

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

const allStates = axios('usState-jobs.json').then(resp => { //brings in the map data 
    console.log('response', resp); //see response in console log
    L.geoJSON(resp.data, {
        style: function (feature) {
            const blueVal = feature.properties.Fem_HealthcareSupport * 60;
            const redVal = feature.properties.Male_HealthcareSupport * 280;
            const greenVal = feature.properties.Total_HealthcareSupport * 15;

            return{
                fillColor: `rgb(${redVal},${greenVal},${blueVal})`,
                //fillColor: "rgb(100,50,10)",
                fillOpacity: 0.7,
                opacity: 0.95,
                color: 'yellow', //colors the borders
                weight: 2
            } 
        }
    }).addTo(map).bringToFront();

    //make a style function to return the info inside (opacity, color etc) 
    function style(feature) {
        console.log('feature', feature)
        return {
            weight: 3,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.6,
            fillColor: getColor(feature[0].properties.Fem_HealthcareSupport)
        }
    }

}) 


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Occupation stats</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.Fem_HealthcareSupport + ' people / mi<sup>2</sup>' : 'Hover over a state');
};

info.addTo(map);


//Adding color - can find colors on https:/ / colorbrewer2.org / #type=sequential & scheme=BuGn & n=3
function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                        d > 20 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}

// function getColor(d) {
//     console.log("d", d)
//     return "yellow"
// }







//Have to pass the style properties as a function - function style(feature)
//Prof advice for final project - 8/9/23
    //getFeature.properties.name - save as string (ex: stateName)
    //pct.data has all data but no geometry
    //take pct.data.filter to filter array
    //p.stateName = stateName  - this joins the two files by state names
    //save filtered array as another var (ex: filteredState)
    //take first index - filteredState[0].occupationName
    //pass filteredState[0].occupationName into getColor function which will return a color

// function style(feature) {
    
//     return {
//         fillColor: getColor(feature.properties.density),
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.7
//     };
// }

// L.geoJson(allStates, { style: style }).addTo(map);

//have to join data - need to match the names from usStates to states pct


//Prof's advice https://gist.github.com/Willjfield/9f9c59b9e5364f059e9c0c5b1186f680
