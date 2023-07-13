//01 Add a map with demo tiles

//https://maplibre.org/maplibre-gl-js/docs/examples/simple-map/
// const map = new maplibregl.Map({
//     container: 'map', // container id
//     style: 'https://demotiles.maplibre.org/style.json', // style URL
//     center: [-73.9205, 40.6803], // starting position [lng, lat]
//     zoom: 9, // starting zoom
//     hash: true //embeds coordinates into web url
// });

//02 Replace with our own map from maptiler

//Open Maptiler my cloud
//Open "Maps", select your map
//Copy the "use vector style" link

const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i', // style URL
    center: [-73.9205, 40.6803], // starting position [lng, lat]
    zoom: 9, // starting zoom
    hash: true
});

//03 Map events
//https://maplibre.org/maplibre-gl-js/docs/API/classes/maplibregl.Map/#events
//https://maplibre.org/maplibre-gl-js/docs/API/classes/maplibregl.Map/#on - Yikes! Why so buried?
//https://docs.mapbox.com/mapbox-gl-js/api/map/#map-events - A little easier to find

// map.once('load',()=>{
//     console.log('loaded!');
// });

// map.once('click',()=>{
//     console.log('clicked!');
// });

// map.on('click',()=>{
//     console.log('clicked!');
// });

//04 Load geojson
//Include Axios
map.once('load', main);

async function main() {
    //Load geojson async/await == .then(...) - does same thing as Promise but diff syntax
    //define async function (runs asynchronously)
    let SchoolGeojson = await axios('../schools.geojson'); //load the geoJson file, store in variable and await until done - same as .then
    //Source = raw data 
    map.addSource('schools-geo-source', {  //name of the source
        'type': 'geojson', //type can be raster layer, vector tile, etc
        'data': SchoolGeojson.data  //data type
    }); //loads the geoJSON but doesn't do anything to mapping - makes raw data available to app - can add multiple layers - can add features

    //https://maplibre.org/maplibre-style-spec/layers/
    //.addLayer - requires id & source
    map.addLayer({
        'id': 'nj-schools',
        'source': 'schools-geo-source',
        'type': 'circle', //can be fill layer, pts etc, includes default color (black) & radius
        'layout': {}, //layout property changes things like text positioning (justified)
        //https://maplibre.org/maplibre-style-spec/layers/#circle
        'paint': { // paint is an object that changes things like color, stroke width, outline, radius
            'circle-color': 'palevioletred',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'white'
        }
    });
    
    //add Events
    addEvents();
}

function addEvents() {
    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'nj-schools', (e) => {
        // console.log()
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        console.log(props)
        popup.setLngLat(coordinates).setHTML(
            `
            <div class='popup-style'>
            <b>${props.SCHOOLNAME}</b>
            <br>
            ${props.DIST_NAME}
            </div>
            `
        ).addTo(map);
    });

    map.on('mouseleave', 'nj-schools', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'initial';
        popup.remove();
    });

    document.getElementById('fly-to').addEventListener('click', () => {
        map.flyTo({
            center: [-73.983486, 40.7489],
            zoom: 16 //set a zoom so that the map is not too far away when you click
        })
    })
}