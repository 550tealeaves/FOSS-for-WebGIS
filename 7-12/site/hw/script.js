//Create the map
const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i', // style URL
    center: [-73.9205, 40.6803], // starting position [lng, lat]
    zoom: 9, // starting zoom
    hash: true
});

//Add marker for GC - https://maplibre.org/maplibre-gl-js/docs/examples/add-a-marker/
const marker = new maplibregl.Marker()
    .setLngLat([-73.98364463562413, 40.74852647353538])
    .addTo(map);


//04 Load geojson - use geojson.io to convert csv or json files to geojson
//Include Axios
map.once('load', main);

async function main() {
    //Load geojson async/await == (equivalent to) .then(...)
    //can also use await axios(https://raw.githubusercontent.com/550tealeaves/FOSS-for-WebGIS/main/7-12/site/hw/airbnb.geojson)
    let airbnbGeojson = await axios('airbnb.geojson'); 
        map.addSource('airbnb-src', {
            'type': 'geojson',
            'data': airbnbGeojson.data
        });
        //console log to see the features names 
        console.log('data', airbnbGeojson);

    //https://maplibre.org/maplibre-style-spec/layers/
    map.addLayer({
        'id': 'airbnb',
        'type': 'circle',
        'source': 'airbnb-src',
        'layout': {},
        //https://maplibre.org/maplibre-style-spec/layers/#circle
        'paint': {
            'circle-color': 'pink',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'indigo'
        }
    });

    //05 Add Map Events
    addEvents();

}

function addEvents() {
    // Create a popup, but don't add it to the map yet.
    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'airbnb', (e) => {
        //06 Add popups
        //https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/

        //console.log(e);
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties.name; //show name in popup
        const neighborhood = e.features[0].properties.neighbourhood; //show neighborhood in popup
        const price = e.features[0].properties.price; //show price in popup
        const reviews = e.features[0].properties.number_of_reviews; //show # reviews in popup
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        //this is what will display in the popup
        //can wrap setHTML in div for further styling
        popup.setLngLat(coordinates).setHTML(
            `
            <div class="popup-style">   
            <b>${name}</b>
            <br>
            ${neighborhood}
            <br>
            $${price}
            <br>
            Reviews: ${reviews}
            </div>
            `
        ).addTo(map);
    });

    map.on('mouseleave', 'airbnb', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    //Select Button on html (based on id) - when clicked, the map will move to the location coordinates specified in the center (GC)
    document.getElementById('fly').addEventListener('click', () => {
        map.flyTo({
            center: [-73.98364463562413, 40.74852647353538],
            zoom: 17, //set a zoom or else map will be too far when you click button
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    });


    

}