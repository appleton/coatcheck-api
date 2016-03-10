const express = require('express');
const Promise = require('bluebird');
const router  = new express.Router();

const twitter         = require('../helpers/twitter');
const reverseGeocoder = require('../helpers/reverse-geocoder');
const logger          = require('../helpers/logger');

const weather           = require('../helpers/infer-weather');
const inferWeather      = weather.inferWeather;
const ALL_WEATHER_TERMS = weather.ALL_WEATHER_TERMS;

const hashTags = ALL_WEATHER_TERMS.map((term) => `#${term}`);
const serchTerms = hashTags.join(' OR ');

function round(num) {
  return Math.round(num * 10000) / 10000
}

router.get('/search', function(req, res) {
  const latitude = round(req.query.latitude);
  const longitude = round(req.query.longitude);

  const now   = new Date();
  const year  = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day   = now.getUTCDate() - 1;

  const query = `since:${year}-${month}-${day} ${serchTerms}`

  const twitterSearch = twitter.get('search/tweets', {
    q:           query,
    geocode:     `${latitude},${longitude},30mi`,
    result_type: 'recent',
    count:       100
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
  }, (error) => {
    logger.log({ at: 'error', error})
    throw error;
  });

});

module.exports = router;
