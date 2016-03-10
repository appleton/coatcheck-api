const logger = require('./logger');
const silencedErrorStatuses = [401, 403];

exports.unauthorized = function(req, res) {
  res.status(403).json({ id: 'unauthorized', message: 'Unauthorized.' });
};

exports.badRequest = function(req, res) {
  res.status(400).json({ id: 'bad_request', message: 'Bad request.' });
};

exports.notFound = function(req, res) {
  res.status(404).json({ id: 'not_found', message: 'Not found.' });
};

exports.unexpected = function(err, req, res) {
  var status = err.statusCode || err.status || 500;

  var shouldReportError = (silencedErrorStatuses.indexOf(status) === -1);
  if (shouldReportError) {
    logger.error(err);
  }

  res.status(status).json({ id: 'unexpected', message: 'An unexpected error occurred' });
};

exports.timeout = function(err, req, res) {
  logger.error(err);

  res.status(504).json({
    id: 'timeout',
    message: 'We did not receive a timely response from the server; please trying refreshing the page and contact support if the issue continues to happen.'
  });
};
