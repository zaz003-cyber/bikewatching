import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

console.log('Mapbox GL JS Loaded:', mapboxgl);

mapboxgl.accessToken = 'pk.eyJ1IjoiemF6MDAzIiwiYSI6ImNtcDdsbGN5bjA0cXUycHB0MWNxNno4MXoifQ.A8k-WSFMUpCX3xjVS-SWGg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 10,
  maxZoom: 18,
});

const bikeLaneStyle = {
  'line-color': '#32D400',
  'line-width': 4,
  'line-opacity': 0.6,
};

const STATIONS_URL = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';

const svg = d3.select('#map').select('svg');

function getCoords(station) {
  const point = new mapboxgl.LngLat(+station.lon, +station.lat);
  const { x, y } = map.project(point);
  return { cx: x, cy: y };
}

map.on('load', async () => {
  map.addSource('boston-bike-lanes', {
    type: 'geojson',
    data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson',
  });

  map.addLayer({
    id: 'boston-bike-lanes',
    type: 'line',
    source: 'boston-bike-lanes',
    paint: bikeLaneStyle,
  });

  map.addSource('cambridge-bike-lanes', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson',
  });

  map.addLayer({
    id: 'cambridge-bike-lanes',
    type: 'line',
    source: 'cambridge-bike-lanes',
    paint: bikeLaneStyle,
  });

  let jsonData;

  try {
    jsonData = await d3.json(STATIONS_URL);
    console.log('Loaded JSON Data:', jsonData);
  } catch (error) {
    console.error('Error loading JSON:', error);
    return;
  }

  const stations = jsonData.data.stations;
  console.log('Stations Array:', stations);

  const circles = svg
    .selectAll('circle')
    .data(stations)
    .enter()
    .append('circle')
    .attr('r', 5);

  function updatePositions() {
    circles
      .attr('cx', (d) => getCoords(d).cx)
      .attr('cy', (d) => getCoords(d).cy);
  }

  updatePositions();

  map.on('move', updatePositions);
  map.on('zoom', updatePositions);
  map.on('resize', updatePositions);
  map.on('moveend', updatePositions);
});