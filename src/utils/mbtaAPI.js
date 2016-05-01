const BASE_URL = "http://realtime.mbta.com/developer/api/v2/stopsbylocation?api_key=wX9NwuHnZU2ToO7GmGR9uw";

function getNearbyStops(lat, long) {
  return fetch(`${BASE_URL}&lat=${lat}&lon=${long}&format=json`)
    .then(data => data.json())
    .then(json => {
      let stops = json.stop.reduce((memo, d) => (
        memo.set(d.parent_station_name || d.stop_name, +d.distance)
      ), new Map());

      return Array.from(stops).map(([k, v]) => ({ name: k, distance: v }));
    });
}

export default {
  getNearbyStops: getNearbyStops
};
