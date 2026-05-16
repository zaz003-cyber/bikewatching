import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';

console.log('Mapbox GL JS Loaded:', mapboxgl);

mapboxgl.accessToken = 'pk.eyJ1IjoiemF6MDAzIiwiYSI6ImNtcDdsdjMzYjA0dmgycnExaTQ5OHd2dWcifQ.ivElO17T36iFPPo1XN3dqQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 10,
  maxZoom: 18,
});