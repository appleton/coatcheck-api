const express = require('express');
const Promise = require('bluebird');
const router  = new express.Router();

const twitter         = require('../helpers/twitter');
const reverseGeocoder = require('../helpers/reverse-geocoder');

const weather           = require('../helpers/infer-weather');
const inferWeather      = weather.inferWeather;
const ALL_WEATHER_TERMS = weather.ALL_WEATHER_TERMS;

const searchQuery = ALL_WEATHER_TERMS.join(' OR ');

router.get('/search', function(req, res) {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  const twitterSearch = twitter.get('search/tweets', {
    q: searchQuery,
    geocode: `${latitude},${longitude},10mi`,
    result_type: 'recent',
    count: 100
  });

  const geoLookup = reverseGeocoder(latitude, longitude);


  Promise.all([twitterSearch, geoLookup]).then((results) => {
    const twitterResult = results[0].data;
    const location = results[1];

    const weather = inferWeather(twitterResult.statuses);

    const responseBody = Object.assign({
      latitude, longitude, location,
      updated_at: (new Date()).toISOString()
    }, weather);

    res.status(200).json(responseBody);
  }, (e) => console.log(e));

});

module.exports = router;
