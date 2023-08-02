//Create the map

const map = new maplibregl.Map({
    container: 'map',
    style: '../subway-color.json', //added my maputnik
    //style: '../class-style.json',
    center: [-74.262, 40.73],
    maxZoom: 15,
    zoom: 13.5,
    bearing: 0,
    pitch: 30,
    hash: true
});

//load the geojson with await async
map.once('load', async () => {
    const properties = await axios('Maplewood_Parcels-4326.geojson');
    const propertyDataArray = properties.data.features;
    // console.log(propertyDataArray[10])

    //use map.addLayer to add layers - uses deck.gl library and creates Mapbox layer and adds it to the map
    //Docs - https://deck.gl/docs/api-reference/aggregation-layers/heatmap-layer 
    map.addLayer(new deck.MapboxLayer({
        id: 'deckgl-heatmap',
        type: deck.HeatmapLayer,
        data: propertyDataArray,
        getPosition: (d) => {
            //console.log(d.geometry.coordinates[0][0][0])
            return d.geometry.coordinates[0][0][0] //this is taking the 1st coordinate from each property - apply value to the 1 pt = gets the position
        },
        getWeight: (d) => {
            // console.log(d)
            switch (d.properties.PEST_USE) {
                case 'NULL': case null:
                    return 0; //if no pesticide use, return 0 (no dots)
                case 'N':
                    return 0
                default:
                    return 1 //will create a red dot
            }
        }, 
        opacity: 0.3
    }),);
})