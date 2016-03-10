const get = require('got').get;

const URL = "https://maps.googleapis.com/maps/api/geocode/json";

function reverseGeocoder(latitude, longitude) {
  return get(URL, {
    json: true,
    query: {
      latlng: `${latitude},${longitude}`,
      result_type: 'locality',
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  }).then((res) => {
    const result = res.body.results[0];
    return result && result.formatted_address;
  });
}

module.exports = reverseGeocoder;
