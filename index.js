const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const apicache = require('apicache');
require('./utils/logger'); // Setup winston logger
const {
  logErrors,
  clientErrorHandler,
  errorHandler,
} = require('./middlewares/errorHandler');

const { PORT, NODE_ENV } = require('./config');

const whitelist = ['http://localhost:3000', 'http://localhost:5000/'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Origin '${origin}' not allowed by cors`));
    }
  },
  credentials: true,
};

apicache.options({
  enabled: NODE_ENV !== 'development', // Disable caching in development
});

const app = express();
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(require('./routes'));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  if (NODE_ENV === 'production') {
    console.log('RUNNING IN PRODUCTION');
    app.use(express.static(path.join(__dirname, 'client', 'build')));
    app.get('/*', (_, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
  }
  console.log('Listening on port ' + PORT);
});
