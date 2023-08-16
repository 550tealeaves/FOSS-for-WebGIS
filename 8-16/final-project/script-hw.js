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

//Adding color - can find colors on https:/ / colorbrewer2.org / #type=sequential & scheme=BuGn & n=3

let jobTitles = [] //create an empty array
let userSelection = 'Fem_HealthcareSupport' //set the field string = to variable
let userSelectionMale = 'Male_HealthcareSupport'
let userSelectionTotal = 'Total_HealthcareSupport'

function getColor(d) {
    console.log('d', d)
    let dataValue = d.properties[userSelection]
    //let dataValue = d.properties['Fem_HealthcareSupport'] //will go into properties (object) and access the field Fem_Health... "d" = feature
    //Create new variable - userSelection to replace string = d.properties[userSelection]
    return dataValue > 0.090 ? '#800026' :
        dataValue > 0.080 ? '#BD0026' :
            dataValue > 0.070 ? '#E31A1C' :
                dataValue > 0.060 ? '#FC4E2A' :
                    dataValue > 0.050 ? '#FD8D3C' :
                        dataValue > 0.020 ? '#FEB24C' :
                            dataValue > 0.010 ? '#FED976' :
                                '#FFEDA0';
} //change the value in lines 27-33 b/c the fields in properties are in decimals - 0-1


function getColorMale(d) {
    console.log('d', d)
    let dataValueMale = d.properties[userSelectionMale]
    //let dataValue = d.properties['Male_HealthcareSupport'] //will go into properties (object) and access the field Fem_Health... "d" = feature
    //Create new variable - userSelectionMale to replace string = d.properties[userSelectionMale]
    return dataValueMale > 0.090 ? '#016450' :
        dataValueMale > 0.080 ? '#02818a' :
            dataValueMale > 0.070 ? '#3690c0' :
                dataValueMale > 0.060 ? '#67a9cf' :
                    dataValueMale > 0.050 ? '#a6bddb' :
                        dataValueMale > 0.020 ? '#d0d1e6' :
                            dataValueMale > 0.010 ? '#ece2f0' :
                                '#fff7fb';
} //change the value in lines 27-33 b/c the fields in properties are in decimals - 0-1

function getColorTotal(d) {
    console.log('d', d)
    let dataValueTotal = d.properties[userSelectionTotal]
    //let dataValue = d.properties['Total_HealthcareSupport'] //will go into properties (object) and access the field Fem_Health... "d" = feature
    //Create new variable - userSelectionTotal to replace string = d.properties[userSelectionTotal]
    return dataValueTotal > 0.090 ? '#6e016b' :
        dataValueTotal > 0.080 ? '#88419d' :
            dataValueTotal > 0.070 ? '#8c6bb1' :
                dataValueTotal > 0.060 ? '#8c96c6' :
                    dataValueTotal > 0.050 ? '#9ebcda' :
                        dataValueTotal > 0.020 ? '#bfd3e6' :
                            dataValueTotal > 0.010 ? '#e0ecf4' :
                                '#f7fcfd';
} //change the value in lines 27-33 b/c the fields in properties are in decimals - 0-1



//Use https://stackoverflow.com/questions/9895082/javascript-populate-drop-down-list-with-array - to learn how to create dropdown and select value

// Use https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript - to learn how to select value

//Save value of selected option (ex: Fem_Health...from dropdown) into a variable - it saves the name of the object key

const allStates = axios('usState-jobs.json').then(resp => { //brings in the map data 
    jobTitles = Object.keys(resp.data.features[0].properties) //use this to be able to select all the job titles
    
    // jobTitles.forEach(function (item) {
    //     const optionObj = document.createElement("option"); //loops through each item in the array and creates an option with the item inside
    //     optionObj.textContent = item;
    //     document.getElementById("selectJob").appendChild(optionObj); //select for the element w/ id selectJob and add the looped item in the array to dropdown
    // }); //This will add all the keys in the dropdown menu
    
    console.log('jobTitles', jobTitles);
    console.log('response', resp); //see response in console log
    L.geoJSON(resp.data, {
        style: function (feature) {
            // const blueVal = feature.properties.Fem_HealthcareSupport * 60;
            // const redVal = feature.properties.Male_HealthcareSupport * 280;
            // const greenVal = feature.properties.Total_HealthcareSupport * 15;

            return{
                fillColor: getColor(feature),
                fillOpacity: 0.95,
                color: 'black', //colors the borders
                weight: 1
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.NAME + ': ' + Math.abs(feature.properties.Fem_HealthcareSupport * 100.0)  + '%' + ' <br>' )
        }
    }).addTo(map).bringToFront();
}) 


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    console.log('props', props)
    this._div.innerHTML = '<h4>Occupation stats</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.Fem_HealthcareSupport + ' people / mi<sup>2</sup>' : 'Hover over a state');
};

info.addTo(map);

//Create the dropdown menu by looping through an array
['Female Healthcare Support', 'Male Healthcare Support', 'Total Healthcare Support'].forEach(function (item) {
    const optionObj = document.createElement("option"); //loops through each item in the array and creates an option with the item inside
    optionObj.textContent = item;
    document.getElementById("selectJob").appendChild(optionObj); //select for the element w/ id selectJob and add the looped item in the array to dropdown
});

var e = document.getElementById("selectJob");
var optionObj = e.value;
var text = e.options[e.selectedIndex].text;


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);








    // function highlightFeature(e) {
    //     const layer = e.target;

    //     layer.setStyle({
    //         weight: 5,
    //         color: '#666',
    //         dashArray: '',
    //         fillOpacity: 0.7
    //     });

    //     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //         layer.bringToFront();
    //     }

    //     info.update(layer.feature.properties.Fem_HealthcareSupport);
    // }

    // var geojson;

    // function resetHighlight(e) {
    //     geojson.resetStyle(e.target);
    //     info.update();
    // }

    // function zoomToFeature(e) {
    //     map.fitBounds(e.target.getBounds());
    // }

    // function onEachFeature(feature, layer) {
    //     layer.on({
    //         mouseover: highlightFeature,
    //         mouseout: resetHighlight,
    //         click: zoomToFeature
    //     });
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
