var myMap = L.map("map", {
    center: [39.83, -95.71], // US centroid
    zoom: 4.49
});

// Add tile layer.
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(queryUrl).then(function(quake) {
    
    var eq = quake.features;

    // First get Array of all earthquake magnitudes
    var allMag = eq.map(feature => feature.properties.mag);
    var allMag_sorted = allMag.sort((a,b) => a-b); //Sort ascending
          
    // Make array of quantiles.
    my_quants = [0, 0.25, 0.50, 0.75, 1]
    
    // Make empty array that will store the breaks for each quantile.
    my_breaks = []
    
    my_quants.forEach(function(quant){
        my_breaks.push(d3.quantile(allMag_sorted, quant));
    })

    // For book-keeping purposes.
    console.log(my_breaks);

    // Now loop over the features, one by one.
    for (var i = 0; i < eq.length; i++){
        
        var lat = eq[i].geometry.coordinates[1];
        var lon = eq[i].geometry.coordinates[0];
        var mag = eq[i].properties.mag;

        var color = "";

        if (mag >= 2){
            color = "red";
        } else if (mag >= 1.33) {
            color  = "orange";
        } else if (mag > 0.81) {
            color = "yellow";
        } else if (mag >= -1.2) {
            color = "green";
        }

        console.log(color);

        L.circleMarker([lat, lon], {
                stroke: true,
                fillOpacity: 0.75,
                color: "black",
                fillColor:color,
                radius: mag * 2,
                weight: 0.5
        }).addTo(myMap);
    };

    // var my_colors = ["green", "yellow", "orange", "red"];
    var categories = ['-1.20 to 0.81','0.81 to 1.33','1.33 to 2.00','2.00 to 6.50'];
    
    var legend = L.control({position: "bottomleft"});
    
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += "<i style=background:red></i>,<span>" + categories[0] + "</span><br>";
    return div;
    }
    legend.addTo(myMap);

});

