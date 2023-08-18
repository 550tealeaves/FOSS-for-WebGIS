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


//Use https://stackoverflow.com/questions/9895082/javascript-populate-drop-down-list-with-array - to learn how to create dropdown and select value

// Use https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript - to learn how to select value

//Save value of selected option (ex: Fem_Health...from dropdown) into a variable - it saves the name of the object key

const allStates = axios('usState-jobs.json').then(resp => { //brings in the map data 
    jobTitles = Object.keys(resp.data.features[0].properties) //use this to be able to select all the job titles

    jobValues = Object.values(resp.data.features[0].properties) //use this to see all the values from the key.value pairs

    // jobValuesList = Object.values(resp.data.features[9,80].properties)
    // console.log('short', jobValuesList)

    console.log('jobValues', jobValues)
    
    // jobTitles.forEach(function (item) {
    //     const optionObj = document.createElement("option"); //loops through each item in the array and creates an option with the item inside
    //     optionObj.textContent = item;
    //     document.getElementById("selectJob").appendChild(optionObj); //select for the element w/ id selectJob and add the looped item in the array to dropdown
    // }); //This will add all the keys in the dropdown menu
    
    console.log('jobTitles', jobTitles);
    console.log('response', resp); //see response in console log
    L.geoJSON(resp.data, {
        style: function (feature) {
            return{
                fillColor: getColor(feature),
                fillOpacity: 0.95,
                color: 'black', //colors the borders
                weight: 1
            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.NAME + ': ' + Math.abs(feature.properties.Fem_HealthcareSupport * 100.0)  + '%' + ' <br>' ),
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }




        
        //Trying to create additional style functions for the other 2 color palettes - not sure how to get them to show
    //     style2: function (feature) {
    //     return {
    //         fillColor: getColorMale(feature),
    //         weight: 2,
    //         opacity: 1,
    //         color: "white",
    //         dashArray: "3",
    //         fillOpacity: 0.7,
    //     };
    // },

    //     style3: function (feature) {
    //         return {
    //             fillColor: getColorTotal(feature),
    //             weight: 2,
    //             opacity: 1,
    //             color: "white",
    //             dashArray: "3",
    //             fillOpacity: 0.7,
    //         };
    //     },
        
    }).addTo(map).bringToFront();

    function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 2.5,
            color: 'navy',
            dashArray: '',
            fillOpacity: 0.8
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        info.update(layer.feature.properties);
    }

    var geojson;

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
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
    console.log('props', props)
    this._div.innerHTML = '<h4>Occupation stats</h4>' + (props ?
        '<b>' + props.NAME + '</b><br />' + Math.round(props.Fem_HealthcareSupport * 100)  + ' % ' + ' women<sup>2</sup>' : 'Hover over a state');
};

info.addTo(map);

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
    return dataValue > 0.090 ? '#b10026' :
        dataValue > 0.080 ? '#e31a1c' :
            dataValue > 0.070 ? '#fc4e2a' :
                dataValue > 0.060 ? '#fd8d3c' :
                    dataValue > 0.050 ? '#feb24c' :
                        dataValue > 0.030 ? '#fed976' :
                            dataValue > 0.010 ? '#ffeda0' :
                                '#ffffcc';
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
                        dataValueMale > 0.030 ? '#d0d1e6' :
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
                        dataValueTotal > 0.030 ? '#bfd3e6' :
                            dataValueTotal > 0.010 ? '#e0ecf4' :
                                '#f7fcfd';
} //change the value in lines 27-33 b/c the fields in properties are in decimals - 0-1




// /* global statesData */
// geojson = L.geoJson(allStates, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(map);


map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


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


 
//Have to pass the style properties as a function - function style(feature)
//Prof advice for final project - 8/9/23
    //getFeature.properties.name - save as string (ex: stateName)
    //pct.data has all data but no geometry
    //take pct.data.filter to filter array
    //p.stateName = stateName  - this joins the two files by state names
    //save filtered array as another var (ex: filteredState)
    //take first index - filteredState[0].occupationName
    //pass filteredState[0].occupationName into getColor function which will return a color
