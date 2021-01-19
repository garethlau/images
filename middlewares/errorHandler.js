const logger = require('winston');
module.exports = {
  logErrors: (error, _0, _1, next) => {
    logger.error(error.stack);
    next(error);
  },
  clientErrorHandler: (error, req, res, next) => {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' });
    } else {
      next(error);
    }
  },
  errorHandler: (error, _0, res, _1) => {
    res.status(500).send(`<pre><code>${error}</code></pre>`);
  },
};
