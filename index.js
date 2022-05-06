var map; /* the actual map */
/* array to hold markers
    marker = {
      id: The id of the marker to match the id of the bus it marks
      object: the marker for the map 
    }
*/
var markers = [];

token =
  "pk.eyJ1Ijoic3RldmVubWNjYXdsZXkiLCJhIjoiY2wydGd1Mzk2MDQ5MzNjb2dhZnh3MHQ3bCJ9.jkD62HJv4CGABESBDdHGeQ";

mapboxgl.accessToken = token;
// Starting coordinates of the map: longitude, latitude
const startingCenter = [-71.0874, 42.347];

// Initialize the map
function init() {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: startingCenter,
    zoom: 13,
  });

  //Handle the buses
  markBuses();
}

// Add buses to map
async function markBuses() {
  //get bus locations
  var buses = await getBusses();

  //log to console FOR DEBBUGING
  // console.log(new Date());
  // console.log(buses);
  // console.log(markers);

  //Get the marker linked to the bus
  //If it already exists, move it
  //If it does not exist, add it
  buses.forEach(function (bus) {
    var marker = markers.find(function (item) {
      return item.id === bus.id;
    });
    if (marker) {
      marker.object.setLngLat([
        bus.attributes.longitude,
        bus.attributes.latitude,
      ]);
    } else {
      createMarker(bus);
    }
  });

  //repeat every 15 seconds
  setTimeout(markBuses, 15000);
}

//Create a marker on the map for the bus
function createMarker(bus) {
  var marker = new mapboxgl.Marker()
    .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
    .addTo(map);

  markers.push({
    id: bus.id,
    object: marker,
  });
}

async function getBusses() {
  var response = await fetch(
    "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip"
  );
  var json = await response.json();
  return json.data;
}

window.onload = init;
