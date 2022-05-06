var map;
var markers = [];
token =
  "pk.eyJ1Ijoic3RldmVubWNjYXdsZXkiLCJhIjoiY2wydGd1Mzk2MDQ5MzNjb2dhZnh3MHQ3bCJ9.jkD62HJv4CGABESBDdHGeQ";
mapboxgl.accessToken = token;
const startingCenter = [-71.104081, 42.365554];
const busIcon = "./bus.png";

// Initialize the map
function init() {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: startingCenter,
    zoom: 10,
  });
  addBuses();
}

// Add buses to map
async function addBuses() {
  //get bus locations
  var locations = await getBusLocations();

  //log to console FOR DEBBUGING
  console.log(new Date());
  console.log(locations);
  console.log(markers);

  //   console.log(
  //     "Bus 1 lat and lng: " +
  //       locations[0].attributes.latitude +
  //       ", " +
  //       locations[0].attributes.longitude
  //   );

  //Get the marker linked to the bus
  //If it already exists, move it
  //If it does not exist, add it
  locations.forEach(function (bus) {
    var marker = getMarker(bus);
    if (marker) {
      moveMarker(marker.object, bus);
    } else {
      createMarker(bus);
    }
  });

  //   console.log("After completion, markers looks like...");
  //   console.log(markers);

  //repeat every 15 seconds
  setTimeout(addBuses, 15000);
}

//Returns the marker object with the given bus
function getMarker(bus) {
  //   console.log("looking for bus...");
  //   console.log(bus);
  //   console.log("in array...");
  //   console.log(markers);
  var marker = markers.find(function (item) {
    // console.log("Item:");
    // console.log(item.getLngLat());
    return (
      //   item.object.getLngLat().lng === bus.attributes.longitude &&
      //   item.object.getLngLat().lat === bus.attributes.latitude
      item.id === bus.id
    );
  });
  //   if (marker) {
  //     console.log("a marker was found!!!");
  //   } else {
  //     console.log("Marker was not found :(");
  //   }
  return marker;
}

//Moves existing marker of bus
function moveMarker(marker, bus) {
  console.log("Bus id " + bus.id + " has a marker. moving it");
  marker.setLngLat([bus.attributes.longitude, bus.attributes.latitude]);
}

//Create a marker on the map for the bus
function createMarker(bus) {
  console.log("Bus id " + bus.id + " does NOT has a marker. creating it");
  var marker = new mapboxgl.Marker()
    .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
    .addTo(map);

  markers.push({
    id: bus.id,
    object: marker,
  });
}

async function getBusLocations() {
  var response = await fetch(
    "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip"
  );
  var json = await response.json();
  return json.data;
}

window.onload = init;
