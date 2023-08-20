//console.log('loaded');

//CREATE BASE MAP LAYERS
let map = L.map('map').setView([46.0, -97.5], 3.4);

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

var geojson; 

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
    const profFields = {
        'prof': {
            'male': 'Male_ProfessionalandRelated',
            'female': 'Fem_ProfessionalandRelated',
            'majority': 'M_F_ProfessionalandRelated',
        },
        'manage': {
            'male': 'Male_ManagementBusinessandFinancialOperations',
            'female': 'Fem_ManagementBusinessandFinancialOperations',
            'majority': 'M_F_ManagementBusinessandFinancialOperations',
        },
        'health': {
            'male': 'Male_HealthcareSupport',
            'female': 'Fem_HealthcareSupport',
            'majority': 'M_F_HealthcareSupport',
        },
        'prot': {
            'male': 'Male_ProtectiveService',
            'female': 'Fem_ProtectiveService',
            'majority': 'M_F_ProtectiveService',
        },
        'food': {
            'male': 'Male_FoodPrepandServing',
            'female': 'Fem_FoodPrepandServing',
            'majority': 'M_F_FoodPrepandServing',
        },
        'build': {
            'male': 'Male_BuildingandGroundsCleaningandMaintenance',
            'female': 'Fem_BuildingandGroundsCleaningandMaintenance',
            'majority': 'M_F_BuildingandGroundsCleaningandMaintenance',
        },
        'personal': {
            'male': 'Male_PersonalCareandService',
            'female': 'Fem_PersonalCareandService',
            'majority': 'M_F_PersonalCareandService',
        },
        'sales': {
            'male': 'Male_SalesandRelated',
            'female': 'Fem_SalesandRelated',
            'majority': 'M_F_SalesandRelated',
        },
        'admin': {
            'male': 'Male_OfficeandAdminSupport',
            'female': 'Fem_OfficeandAdminSupport',
            'majority': 'M_F_OfficeandAdminSupport',
        },
        'farm': {
            'male': 'Male_FarmingFishingandForestry',
            'female': 'Fem_FarmingFishingandForestry',
            'majority': 'M_F_FarmingFishingandForestry',
        },
        'construct': {
            'male': 'Male_ConstructionExtractionandMaintenance',
            'female': 'Fem_ConstructionExtractionandMaintenance',
            'majority': 'M_F_ConstructionExtractionandMaintenance',
        },
        'prod': {
            'male': 'Male_Production',
            'female': 'Fem_Production',
            'majority': 'M_F_Production',
        },
        'transp': {
            'male': 'Male_TranspoandMaterialMoving',
            'female': 'Fem_TranspoandMaterialMoving',
            'majority': 'M_F_TranspoandMaterialMoving',
        }
    };
    let userSelection = '';

    geojson = L.geoJSON(resp.data, {
        style: function (feature) {
            return {
                fillColor: getColor(feature),
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

    }).addTo(map).bringToFront();

    //Create event change function
    function selectEventHandler(e) {
        userSelection = e.target.value;

        geojson.eachLayer(function (layer) {

            layer.setStyle({
                fillColor: getColor(layer.feature),
                fillOpacity: 0.95,
                color: 'black', //colors the borders
                weight: 1
            }
            );

        });

    }
    //Target the HTML that will change and add eventListener
    document.getElementById("selectJob").addEventListener('change', selectEventHandler);


    // // CREATE COLOR VARIABLE
    function getColor(d) {

        if (userSelection.length === 0) return '#8888';
        //move the below 3 fields (to the hover section)
        const fields = profFields[userSelection];
        console.log('fields', fields)
        const maleValue = d.properties[fields.male];
        console.log('males', maleValue)
        const femaleValue = d.properties[fields.female];
        console.log('female', femaleValue)

        let majorityValue = d.properties[fields.majority];
        console.log('majority', majorityValue)

        return majorityValue == 'F' ? '#fdae6b' :
            majorityValue == 'M' ? '#542788' :
                '#ffffff';



                
    }

    function getStyle(feature) {
        return {
            fillColor: getColor(feature),
            fillOpacity: 0.95,
            color: 'black', //colors the borders
            weight: 1
        }
    }




    function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 2.5,
            color: '#2cc1f7',
            dashArray: '',
            fillOpacity: 0.8
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        info.update(layer.feature.properties);
    }


    function resetHighlight(e) {
        console.log(resetHighlight)
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

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
        '<b>' + props.NAME + '</b><br />' + ([userSelection.femaleValue] * 100).toFixed(1) + ' % ' + ' women' + '<br />' + ([userSelection.maleValue] * 100).toFixed(1) + ' % ' + 'men' : 'Hover over a state');

    }; info.addTo(map);

})


var popup = L.popup();

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');






// ADD COLOR 
// Find colors on https:/ / colorbrewer2.org / #type=sequential & scheme=BuGn & n=3

let jobTitles = [] //create an empty array
let userSelectionChange = 'Fem_ProfessionalandRelated' //set the field string = to variable



function getColorOne(d) {
    console.log('d', d)
    let dataValue = d.properties[userSelectionChange]
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





map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');
 
