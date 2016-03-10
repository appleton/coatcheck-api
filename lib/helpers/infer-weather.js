const WEATHER = {
  rain:  ['rain', 'rainy', 'raining', 'wet', 'storm'],
  sun:   ['sun', 'sunny', 'sunshine', 'bright'],
  fog:   ['fog', 'foggy', 'mist', 'misty'],
  wind:  ['wind', 'windy', 'blustery', 'blowing', 'gale'],
  cloud: ['cloud', 'cloudy', 'gloomy', 'grey', 'gray'],
  snow:  ['snow', 'snowy', 'snowing', 'uksnow', 'flurry', 'snowstorm']
}

function includes(array, item) {
  return array.indexOf(item) > -1;
}

function filterWeatherBots(tweets) {
  return tweets.filter((tweet) => {
    if (tweet.text.indexOf('Wind 0') !== -1) { return false; }
    if (tweet.text.indexOf('Temp:') !== -1) { return false; }
    return true;
  });
}

// Produce an object like { 0: 'wind', 12: 'rain' }

function infer(tweet) {
  const tweetWords = tweet.text.split(' ').map((word) => word.toLowerCase());

  const scores = Object.keys(WEATHER).reduce(function(memo, key) {
    const weatherWords = WEATHER[key];

    const count = weatherWords.reduce(function(sum, weatherWord) {
      const included = includes(tweetWords, weatherWord) ||
                       includes(tweetWords, `#${weatherWord}`);

      if (included) {
        sum += 1;
      }

      return sum;
    }, 0);

    memo[count] = key;

    return memo;
  }, {});

  const scoreCounts = Object.keys(scores).filter((score) => score > 0);
  const highScore = Math.max.apply(Math, scoreCounts);

  return scores[highScore];
}

function groupByWeather(tweets) {
  return tweets.reduce(function(memo, tweet) {
    const weather = infer(tweet);

    if (weather) {
      if (!memo.hasOwnProperty(weather)) {
        memo[weather] = [];
      }
      memo[weather].push(tweet)
    }

    return memo;
  }, {});
}

function serialize(weather, supporting_tweets) {
  return { weather, supporting_tweets };
}

function inferWeather(tweets) {
  tweets = filterWeatherBots(tweets);
  const grouped = groupByWeather(tweets);

  const mostLikely = Object.keys(grouped).reduce((highest, groupName) => {
    const group = serialize(groupName, grouped[groupName]);

    if (highest == null || group.tweets.length > highest.tweets.length) {
      return group;
    }
  }, null);

  return mostLikely;
}

module.exports = inferWeather;