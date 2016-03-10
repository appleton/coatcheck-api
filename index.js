const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'development') {
  require('dotenv').load();
}

const express  = require('express');
const enforce  = require('express-sslify');
const app      = express();
const logger   = require('./lib/helpers/logger');

if (NODE_ENV === 'production') {
  app.use(enforce.HTTPS(true));
}

app.use(logger.requestLogger());

app.use(require('./lib/routes/index'));
app.use(require('./lib/routes/search'));
app.use(require('./lib/middleware/error-handler'));

const server = app.listen(process.env.PORT || 5000);

exports.app = app;
exports.server = server;
