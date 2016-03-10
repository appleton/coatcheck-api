const express = require('express');
const router  = new express.Router();
const twitter = require('../helpers/twitter');

router.get('/search', function(req, res) {
  twitter.get('search/tweets', {
    geocode: `${req.query.latitude},${req.query.longitude},10mi`
  }, function(err, data) {
    res.status(200).json({
      tweets: data
    });
  });
});

module.exports = router;
