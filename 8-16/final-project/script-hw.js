console.log('loaded');

//CREATE BASE MAP LAYERS
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
                fillColor: getColorMFSales(feature),
                fillOpacity: 0.95,
                color: 'black', //colors the borders
                weight: 1
            }
        },
        //onEachFeature - can click and display state name 
        onEachFeature: function (feature, layer) {
            // layer.bindPopup(feature.properties.STUSPS + ': ' + Math.round(feature.properties.Fem_HealthcareSupport * 100.0)  + '%' + ' <br>' ), not needed b/c highlight shows percentages
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
            color: '#67000d',
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


// CONTROL THAT SHOWS STATE INFO IN HOVER
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    console.log('props', props)
    this._div.innerHTML = '<h4>Occupation stats</h4>' + (props ?
        '<b>' + props.NAME + '</b><br />' + Math.round(props.Fem_SalesandRelated * 100) + ' % ' + ' women' + '<br />' + Math.round(props.Male_SalesandRelated * 100) + ' % ' + 'men' : 'Hover over a state');
};

info.addTo(map);

// ADD COLOR 
// Find colors on https:/ / colorbrewer2.org / #type=sequential & scheme=BuGn & n=3

let jobTitles = [] //create an empty array
let userSelection = 'Fem_ProfessionalandRelated' //set the field string = to variable
let userSelectionMale = 'Male_ProfessionalandRelated'
let userSelectionTotal = 'Total_ProfessionalandRelated'
let userSelectionMFBus = 'M_F_ManagementBusinessandFinancialOperations'
let userSelectionMFProf = 'M_F_ProfessionalandRelated'
let userSelectionMFHealth = 'M_F_HealthcareSupport'
let userSelectionMFProt = 'M_F_ProtectiveService'
let userSelectionMFFood = 'M_F_FoodPrepandServing'
let userSelectionMFBuild = 'M_F_BuildingandGroundsCleaningandMaintenance'
let userSelectionMFPers = 'M_F_PersonalCareandService'
let userSelectionMFSales = 'M_F_SalesandRelated'
let userSelectionMFOffice = 'M_F_OfficeandAdminSupport'
let userSelectionMFFarm = 'M_F_FarmingFishingandForestry'
let userSelectionMFCon = 'M_F_ConstructionExtractionandMaintenance'
let userSelectionMFProd = 'M_F_Production'
let userSelectionMFTransp = 'M_F_TranspoandMaterialMoving'


function getColor(d) {
    console.log('d', d)
    let dataValue = d.properties[userSelection]
    //let dataValue = d.properties['Fem_HealthcareSupport'] //will go into properties (object) and access the field Fem_Health... "d" = feature
    //Create new variable - userSelection to replace string = d.properties[userSelection]
    return dataValue > 0.399 ? '#b10026' :
        dataValue > 0.342 ? '#e31a1c' :
            dataValue > 0.285 ? '#fc4e2a' :
                dataValue > 0.228 ? '#fd8d3c' :
                    dataValue > 0.171 ? '#feb24c' :
                        dataValue > 0.114 ? '#fed976' :
                            dataValue > 0.05 ? '#ffeda0' :
                                '#ffffcc';
} //change the value in dataValue > #### b/c the fields in properties are in decimals - 0-1


function getColorMale(d) {
    console.log('d', d)
    let dataValue = d.properties[userSelectionMale]
    //let dataValue = d.properties['Male_HealthcareSupport'] //will go into properties (object) and access the field Fem_Health... "d" = feature
    //Create new variable - userSelectionMale to replace string = d.properties[userSelectionMale]
    return dataValue > 0.090 ? '#016450' :
        dataValue > 0.080 ? '#02818a' :
            dataValue > 0.070 ? '#3690c0' :
                dataValue > 0.060 ? '#67a9cf' :
                    dataValue > 0.050 ? '#a6bddb' :
                        dataValue > 0.030 ? '#d0d1e6' :
                            dataValue > 0.010 ? '#ece2f0' :
                                '#fff7fb';
} 

function getColorTotal(d) {
    console.log('d', d)
    let dataValue = d.properties[userSelectionTotal]
    //let dataValue = d.properties['Total_HealthcareSupport'] //will go into properties (object) and access the field Fem_Health... "d" = feature
    //Create new variable - userSelectionTotal to replace string = d.properties[userSelectionTotal]
    return dataValue > 0.090 ? '#6e016b' :
        dataValue > 0.080 ? '#88419d' :
            dataValue > 0.070 ? '#8c6bb1' :
                dataValue > 0.060 ? '#8c96c6' :
                    dataValue > 0.050 ? '#9ebcda' :
                        dataValue > 0.030 ? '#bfd3e6' :
                            dataValue > 0.010 ? '#e0ecf4' :
                                '#f7fcfd';
} 


function getColorMFBus(d) {
    let dataValue = d.properties[userSelectionMFBus]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}


function getColorMFProf(d) {
    let dataValue = d.properties[userSelectionMFProf]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}

function getColorMFHealth(d) {
    let dataValue = d.properties[userSelectionMFHealth]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}


function getColorMFProt(d) {
    let dataValue = d.properties[userSelectionMFProt]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}


function getColorMFFood(d) {
    let dataValue = d.properties[userSelectionMFFood]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}


function getColorMFBuild(d) {
    let dataValue = d.properties[userSelectionMFBuild]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}


function getColorMFPers(d) {
    let dataValue = d.properties[userSelectionMFPers]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}

function getColorMFSales(d) {
    let dataValue = d.properties[userSelectionMFSales]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}

function getColorMFOffice(d) {
    let dataValue = d.properties[userSelectionMFOffice]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}


function getColorMFFarm(d) {
    let dataValue = d.properties[userSelectionMFFarm]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}

function getColorMFCon(d) {
    let dataValue = d.properties[userSelectionMFCon]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}

function getColorMFProd(d) {
    let dataValue = d.properties[userSelectionMFProd]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}

function getColorMFTransp(d) {
    let dataValue = d.properties[userSelectionMFTransp]
    return dataValue == 'F' ? '#fdae6b' :
        dataValue == 'M' ? '#542788' :
            '#ffffff';

}

//UPDATE THE DROPDOWN SELECTION TO CHANGE THE MAP
//https://stackoverflow.com/questions/6727917/javascript-dropdown-updates-the-price-based-on-the-users-selection

//option 1
// var searchOption = new Array('', '$12.00', '$18.00', '$0.89');
// $(function () {
//     $('select[name=jobs]').change(function () {
//         alert(searchOption[$(this).val()]);
//     });

//     // Trigger on dom ready
//     $('select[name=jobs]').change();
// });

//option 2
function changeOption (industry) {
    var searchField = document.getElementById("selectJob");
    searchField.selectedIndex = 1;
    document.getElementById("selectJob").value = industry;
}



// // CREATE DROPDOWN MENU BY LOOPING THROUGH ARRAY
// ['Female Professional and Related', 'Male Professional and Related', 'Total Professional and Related'].forEach(function (item) {
//     const optionObj = document.createElement("option"); //loops through each item in the array and creates an option with the item inside
//     optionObj.textContent = item;
//     document.getElementById("selectJob").appendChild(optionObj); //select for the element w/ id selectJob and add the looped item in the array to dropdown
// });


// //CREATE DROPDOWN MENU BY LOOPING THROUGH ARRAY
// ['Management, Business, & Financial Operations', 'Professional & Related', 'Healthcare Support', 'Protective Service', 'Food Prep & Serving', 'Building & Grounds Cleaning & Maintenance', 'Personal Care & Service', 'Sales & Related', 'Office & Admin Support', 'Farming, Fishing, & Forestry', 'Construction, Extraction, & Maintenance', 'Production', 'Transportation & Moving'].forEach(function (item) {
//     const optionObj = document.createElement("option"); //loops through each item in the array and creates an option with the item inside
//     optionObj.textContent = item;
//     document.getElementById("dropdown").appendChild(optionObj); //select for the element w/ id selectJob and add the looped item in the array to dropdown
// });

//option 3
// var e = document.getElementById("selectJob");
// let userChange = e.userSelectionMFSales;
// var text = e.options[e.selectedIndex].text;


var popup = L.popup();



/* global allStates */
geojson = L.geoJson(allStates, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');
 
//Have to pass the style properties as a function - function style(feature)
//Prof advice for final project - 8/9/23
    //getFeature.properties.name - save as string (ex: stateName)
    //pct.data has all data but no geometry
    //take pct.data.filter to filter array
    //p.stateName = stateName  - this joins the two files by state names
    //save filtered array as another var (ex: filteredState)
    //take first index - filteredState[0].occupationName
    //pass filteredState[0].occupationName into getColor function which will return a color
