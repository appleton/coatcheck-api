const errors = require('../helpers/errors');
const logger = require('../helpers/logger');

module.exports = function(err, req, res, next) { //eslint-disable-line no-unused-vars
  logger.log({ msg: err.message });
  if (err.message === 'ETIMEDOUT') {
    return errors.timeout(err, req, res);
  } else {
    if (process.env.NODE_ENV !== 'production') { console.error(err.stack);  }
    return errors.unexpected(err, req, res);
  }
};
