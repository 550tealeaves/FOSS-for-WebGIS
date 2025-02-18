//creates map - use the API page in maplibre 
const map = new maplibregl.Map({
    container: 'map', // container id
    style: "../site/class-style.json", //using this style.json (from maputnik)
    hash: true,
    center: [-73.9536, 40.748], // starting position
    zoom: 12 // starting zoom
});

//Add the historical map
map.once('load', () => {
    map.addSource('nyc-src', {
        'type': 'image',
        'url': '/historical-maps-of-manhattan.jpg',
        'coordinates': [  //reverse coordinates so that they are lng/lat, NOT lat/lng
            [-73.99816, 40.84100],
            [-73.87625, 40.79040],
            [-73.96897, 40.67443],
            [-74.08249, 40.72430]
        ]
    });
    
//Add the map layer
    map.addLayer({
        'id': 'nyc',
        'source': 'historical-nyc-src',
        'type': 'raster'
    }, 'subways'); //putting 'subways' after will place the historical map BEHIND the subways - subways comes from the saved maputnik style JSON file

    //Create slider that will trigger eventListener
    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('slider-value');

    //Adds eventListener - when slider value changes, change the raster opacity
    slider.addEventListener('input', (e) => {
        // Adjust the layers opacity. layer here is arbitrary - this could
        // be another layer name found in your style or a custom layer
        // added on the fly using `addSource`.
        map.setPaintProperty(
            'nyc',
            'raster-opacity', //this is what will change as slider changes (old map fades to new)
            parseInt(e.target.value, 10) / 100
        );

        // Value indicator
        sliderValue.textContent = e.target.value + '%';
    });


    //Turfs.js - measure distance between 2 clicks
    //start these as empty arrays
    let distancePnts = [];
    let markers = [];



    //1st make 2 markers and then add coordinates 
    map.on('click', (e) => {
        if (markers.length > 1) {
            markers.forEach(m => m.remove());
            markers = [];
        }

        markers.push(new maplibregl.Marker()
            .setLngLat(e.lngLat)
            .addTo(map));
        distancePnts.push(turf.point([e.lngLat.lng, e.lngLat.lat]))
        if (distancePnts.length < 2) return;
        let options = { units: 'miles' };
        let distance = turf.distance(distancePnts[0], distancePnts[1], options);
        console.log(distance);
        distancePnts = [];

    });
});
