const logger = require('winston');
const { format, transports } = require('winston');
const { combine, timestamp, json, colorize, simple } = format;

const NODE_ENV = process.env.NODE_ENV || 'dev';

logger.add(
  new transports.File({
    filename: '/logs/error.log',
    level: 'error',
    format: combine(timestamp(), json()),
  })
);

if (NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), simple()),
      level: 'info',
    })
  );
}

module.exports = logger;
