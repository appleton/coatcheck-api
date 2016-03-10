const express = require('express');
const router  = new express.Router();
const twitter = require('../helpers/twitter');
const weather = require('../helpers/infer-weather');
const inferWeather = weather.inferWeather;
const ALL_WEATHER_TERMS = weather.ALL_WEATHER_TERMS;

const searchQuery = ALL_WEATHER_TERMS.join(' OR ');

router.get('/search', function(req, res) {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  twitter.get('search/tweets', {
    q: searchQuery,
    geocode: `${latitude},${longitude},10mi`,
    result_type: 'recent',
    count: 100
  }, function(err, data) {
    const weather = inferWeather(data.statuses);

    const responseBody = Object.assign({
      latitude, longitude,
      updated_at: (new Date()).toISOString()
    }, weather);

    res.status(200).json(responseBody);
  });
});

module.exports = router;
