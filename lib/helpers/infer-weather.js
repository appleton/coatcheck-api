const WEATHER = {
  rain:  ['rain', 'rainy', 'raining', 'wet', 'storm', 'deluge', 'drizzle', 'showers', 'pouring', 'downpour'],
  sun:   ['sun', 'sunny', 'sunshine', 'bright', 'sunlit', 'fine', 'shining'],
  fog:   ['fog', 'foggy', 'mist', 'misty', 'smog', 'haze'],
  wind:  ['wind', 'windy', 'blustery', 'blowing', 'gale', 'breeze', 'breezy', 'gust', 'gusty'],
  cloud: ['cloud', 'cloudy', 'gloomy', 'grey', 'gray', 'overcast'],
  snow:  ['snow', 'snowy', 'snowing', 'uksnow']
}

const ALL_WEATHER_TERMS = Object.keys(WEATHER).reduce((memo, key) => {
  return memo.concat(WEATHER[key]);
}, []);

const MS_IN_A_DAY = 86400000;

function includes(array, item) {
  return array.indexOf(item) > -1;
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

// Score each group of tweets based on how many tweets and how recent
function groupScore(group) {
  const now = Date.now();

  return group.supporting_tweets.reduce((score, tweet) => {
    const tweetedAt = new Date(tweet.created_at).valueOf();
    const timeAgo = now - tweetedAt;

    return score + MS_IN_A_DAY - (timeAgo * 4);
  }, 0);
}

function inferWeather(tweets) {
  const grouped = groupByWeather(tweets);

  const groups = Object.keys(grouped).map((key) => serialize(key, grouped[key]));

  const mostLikely = groups.sort((a, b) => {
    if (groupScore(a) < groupScore(b)) { return 1; }
    if (groupScore(a) > groupScore(b)) { return -1; }
    return 0;
  })[0];

  return mostLikely;
}

module.exports.WEATHER = WEATHER;
module.exports.ALL_WEATHER_TERMS = ALL_WEATHER_TERMS;
module.exports.inferWeather = inferWeather;
