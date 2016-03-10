const Twitter = require('twit');

const client = new Twitter({
  consumer_key:    process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth:   true
  // access_token:        process.env.TWITTER_ACCESS_TOKEN_KEY,
  // access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = client;
