var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-10-25&endtime=" +
    "2020-10-31&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: (feature.properties.mag *5),
                color: "black",
                weight: .2,
                opacity: 1,
                fillColor: "lightgreen",
                fillOpacity: 0.8,
                
            })
        },
        onEachFeature: function (feature, layer) {
                layer.bindPopup("<h3>" + feature.properties.place +
                        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
                }
            });

            // Sending our earthquakes layer to the createMap function
            createMap(earthquakes);
            };
function createMap(earthquakes) {

        // Define streetmap and darkmap layers
        var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: API_KEY
        });

        var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "dark-v10",
            accessToken: API_KEY
        });

        // Define a baseMaps object to hold our base layers
        var baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
        };

        // Create overlay object to hold our overlay layer
        var overlayMaps = {
            Earthquakes: earthquakes
        };

        // Create our map, giving it the streetmap and earthquakes layers to display on load
        // var mymap = L.map('mapid').setView([37.09, -95.71], 13);
        var myMap = L.map("mapid", {
            center: [
                37.09, -95.71
            ],
            zoom: 5,
            layers: [streetmap, earthquakes]
        });

        // Create a layer control - this is the selection box in the corner
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);
    }
