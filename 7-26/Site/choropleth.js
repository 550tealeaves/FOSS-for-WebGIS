const povertyEst = await d3.csv("PovertyEstimates.csv"); //IMPORTANT! Had to delete first rows of metadata and titles
console.log('poverty', povertyEst);
const us = await d3.json("us.json"); //don't continue executing code until the file is loaded


makeChart(); //execute this function 

function makeChart() {
    const color = d3.scaleQuantize([1, 30], d3.schemeYlOrRd[9]); //Round to nearest 1-30 integer and use the built-in yellow-orange-red colorscheme with 9 values to match - map values 1-20 to this color scheme that has 9 values 
    const valuemap = new Map(povertyEst.map(d => [+d.FIPS_Code, d.PCTPOVALL_2021])); //This makes a value map that d3 can easily look up in the color function - new Map = data structure that will take FIPS-code from each row and % poverty and store that in easily accessible way for D3
    console.log(Map);

    const width = 975; //Set the width and height of the canvas
    const height = 610;

    //Make the map zoomable
    const zoom = d3.zoom()
        .scaleExtent([1, 8]) //min/max zoom levels 
        .on("zoom", zoomed); //attach zoom event

    //Append an svg canvas to the body
    const svg = d3.select("body") //append empty svg
        .append("svg")
        .attr("viewBox", [0, 0, width, height]) //Fixes the aspect ratio
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;")
        .on("click", reset); //Attach a click event - reset


    //The function that will create the path elements in the svg
    //The function will be used to create the d attr
    const path = d3.geoPath(); //path is a function that will have something passed into it 

    //Create a group to hold the map
    const g = svg.append("g");

    //Create a group inside that group
    const counties = g.append("g")
        .attr("cursor", "pointer")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .join("path")
        .attr("fill", d => color(valuemap.get(+d.id))) //Important! This (and any data based features) has to come AFTER the data is joined to the path (won't know what data to use)!
        //create function that takes d (feature), get the id for that feature (d). Look up the value for this id and pass that into the color function
        //Ex: Get the value for FIPS-Code 10 and pass that value into the color function. Returns a string (the actual color) from the scale
        .on("click", clicked) //add the clicked event
        .attr("d", path); //Takes the joined data and runs it through the path function

    counties.append("title")
        .text(d => d.properties.name);

    //Remove so we only outline the county selected
    g.append("path")
        .attr("fill", "none")
        .attr("stroke", "none")
        .attr("stroke-linejoin", "round")
        .attr("d", path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b))); //Uses the topojson library to transform the topojson mesh into an svg path

    svg.call(zoom); //Call the zoom function from the zoom library

    // Resets the state of the map and zooms out to the initial view.
    function reset() {
        counties.transition().style("fill", null);
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    }

    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d); //Gets the bounds of the path
        event.stopPropagation();
        counties.transition().style("stroke", null);
        d3.select(this).transition().style("stroke", "white"); //Styles the path
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))) //Sets the zoom identity matrix
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, svg.node())
        );
    }

    function zoomed(event) {
        const { transform } = event;

        g.attr("transform", transform);
        g.attr("stroke-width", 3 / transform.k); //K is zoom
    }



    return svg.node();
}