// Define arrays to hold created Earthquake Markers and Plate Boundary Lines
var earthquakesMarkers = [];
var plateLines = [];

function getColor(d) {
  if (d >= 0 && d < 1) {return "LawnGreen"}
  else if (d >= 1 && d < 2) {return "YellowGreen"}
  else if (d >= 2 && d < 3) {return "Orange"}
  else if (d >= 3 && d < 4) {return "LightSalmon"}
  else if (d >= 4 && d < 5) {return "LightCoral"}
  else {return "IndianRed"}
};

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl, function(data) {
  console.log(data.features)
  for (var i = 0; i < data.features.length; i++) {
    var record = data.features[i]
    var longitude = record.geometry.coordinates[0];
    var latitude = record.geometry.coordinates[1];
    var magnitude = record.properties.mag;
    earthquakesMarkers.push(
      L.circle([latitude, longitude], {
         fillOpacity: 0.9,
         color: "black",
         weight: 0.5,
        fillColor: getColor(magnitude),
        radius: magnitude*15000})
      .bindPopup("<h3>" + record.properties.place + "</h3> <hr> <p>Magnitude: " + magnitude + "</p>")
      );
    }
   //});

  // d3.json("static/GeoJSON/PB2002_plates.json", function(data2){
  d3.json("static/GeoJSON/PB2002_boundaries.json", function(data2){
    for (var i = 0; i < data2.features.length; i++) {
      var coord = data2.features[i].geometry.coordinates;
      // console.log(coord)

      var coordModified = []
      for (var j = 0; j < coord.length; j++) {
        coordModified.push([coord[j][1],coord[j][0]])
      };
    
      plateLines.push(
        L.polyline(coordModified, {color: "orange"})
      )};

   // Define variables for base layers
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });


  // Create a baseMaps object
  var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": graymap,
    "Outdoors": outdoorsmap
  };

  // Create two separate layer groups
  var earthquakes = L.layerGroup(earthquakesMarkers);
  var faultline = L.layerGroup(plateLines);


  console.log(earthquakesMarkers)
  console.log(plateLines)
  // Create an overlay object
  var overlayMaps = {
  "Fault Lines": faultline,
  "Earthquakes": earthquakes
  };

  // Define a map object
  var myMap = L.map("map", {
  center: [40.09, -30.71],
  zoom: 2,
  layers: [satellitemap, faultline, earthquakes]
  });


  // Pass map layers into layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, 
  {collapsed: false
  }).addTo(myMap);


  //Add legend
  var legend = L.control({position: "bottomright"});
  
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    magnitude = ["0","1","2","3","4","5"];
    colors = ["LawnGreen","YellowGreen","Orange","LightSalmon","LightCoral","IndianRed"]
    for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML += "<i style='background:" + getColor(magnitude[i]) + "'></i> " + magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }
  return div;
  };
  legend.addTo(myMap);

  });
});








