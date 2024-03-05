mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

var el = document.createElement("div");
el.innerHTML =
  '<svg height="50" width="30"><circle cx="15" cy="15" r="10" stroke="black" stroke-width="2" fill="red" /><path d="M 15 25 L 15 50" stroke="black" stroke-width="2"/></svg>';

var marker = new mapboxgl.Marker(el)
  .setLngLat(campground.geometry.coordinates) // longitude, latitude
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  ) // add popups
  .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
