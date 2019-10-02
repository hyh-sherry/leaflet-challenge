var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
  console.log(data.features)
  for (var i = 0; i < data.features.length; i++) {
    var record = data.features[i]
    var longitude = record.geometry.coordinates[0];
    var latitude = record.geometry.coordinates[1];
    var magnitude = record.properties.mag;

    var color = "";
    if (magnitude > 0 && magnitude <= 1) {
      color = "LawnGreen";
    }
    else if (magnitude > 1 && magnitude <= 2) {
      color = "YellowGreen";
    }
    else if (magnitude > 2 && magnitude <= 3) {
      color = "Gold";
    }
    else if (magnitude > 3 && magnitude <= 4) {
      color = "Orange";
    }
    else if (magnitude > 4 && magnitude <= 5) {
      color = "LightSalmon";
    }
    else {
      color = "LightCoral";
    }

    L.circle([latitude, longitude], {
      fillOpacity: 0.9,
      color: "black",
      weight: 0.5,
      fillColor: color,
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: magnitude*15000
    })
    .bindPopup("<h3>" + record.properties.place + "</h3> <hr> <p>Magnitude: " + magnitude + "</p>")
    .addTo(myMap);
  }
 });


var legend = L.control({position: "bottomright"});


function getColor(d) {
  return d > 5 ? "LightCoral" :
  d > 4? "LightSalmon" :
  d > 3? "Orange" :
  d > 2? "YellowGreen" :
  "LawnGreen" ;
  };

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
  magnitude = ["1","2","3","4","5"];
  colors = ["LawnGreen","YellowGreen","Gold","Orange","LightSalmon","LightCoral"]
  for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML += "<i style='background:" + getColor(magnitude[i] + 1) + "'></i> " + magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+')};
  return div;
  };
legend.addTo(myMap);