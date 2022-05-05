var map;
var markers = [];
token =
  "pk.eyJ1Ijoic3RldmVubWNjYXdsZXkiLCJhIjoiY2wydGd1Mzk2MDQ5MzNjb2dhZnh3MHQ3bCJ9.jkD62HJv4CGABESBDdHGeQ";
mapboxgl.accessToken = token;
const startingCenter = [-71.104081, 42.365554];

// Initialize the map
function init() {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: startingCenter,
    zoom: 10,
  });
}

window.onload = init;
