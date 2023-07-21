//Create the map
const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i', // style URL
    center: [-73.9205, 40.6803], // starting position [lng, lat]
    zoom: 9, // starting zoom
    hash: true
});


//04 Load geojson - must first convert the file to geoJSON - regular JSON file doesn't work
//Include Axios
map.once('load', main);

async function main() {
    //Load geojson async/await == .then(...)
    let airbnbGeojson = await axios('airbnb.json').then(resp => {
        console.log("data", resp.data);

        map.addSource('airbnb-src', {
            'type': 'json',
            'data': airbnb.data
        });

    })
    // map.addSource('NYC_airbnb_2019-src', {
    //     'type': 'json',
    //     'data': NYC_airbnb_2019.data
    // });

    

//     //https://maplibre.org/maplibre-style-spec/layers/
//     map.addLayer({
//         'id': 'airbnb',
//         'type': 'circle',
//         'source': 'NYC_airbnb_2019-src',
//         'layout': {},
//         //https://maplibre.org/maplibre-style-spec/layers/#circle
//         'paint': {
//             'circle-color': 'gold',
//             'circle-stroke-width': 2,
//             'circle-stroke-color': 'brown'
//         }
//     });

//     //05 Add Map Events
//     addEvents();

// }

// function addEvents() {
//     // Create a popup, but don't add it to the map yet.
//     const popup = new maplibregl.Popup({
//         closeButton: false,
//         closeOnClick: false
//     });

//     map.on('mouseenter', 'airbnb', (e) => {
//         //06 Add popups
//         //https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/
        
//         //console.log(e);
//         // Change the cursor style as a UI indicator.
//         map.getCanvas().style.cursor = 'pointer';

//         const coordinates = e.features[0].geometry.coordinates.slice();
//         const name = e.features[0].properties.SCHOOLNAME; //want to display name in popup
//         const district = e.features[0].properties.DIST_NAME; //want to display district in popup
//         // Ensure that if the map is zoomed out such that multiple
//         // copies of the feature are visible, the popup appears
//         // over the copy being pointed to.
//         while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//         }

//         // Populate the popup and set its coordinates
//         // based on the feature found.
//         //this is what will display in the popup
//         //can wrap setHTML in div for further styling
//         popup.setLngLat(coordinates).setHTML(
//             `
//             <div class="popup-style">   
//             <b>${name}</b>
//             <br>
//             ${district}
//             </div>
//             `
//         ).addTo(map);
//     });

//     map.on('mouseleave', 'schools', () => {
//         map.getCanvas().style.cursor = '';
//         popup.remove();
//     });

//     //Select Button on html (based on id) - when clicked, the map will move to the location coordinates specified in the center (Bryant Park)
//     document.getElementById('fly').addEventListener('click', () => {
//         map.flyTo({
//             center: [-73.98344561474633, 40.75380245526688],
//             zoom: 17, //set a zoom or else map will be too far when you click button
//             essential: true // this animation is considered essential with respect to prefers-reduced-motion
//         });
//     });

}