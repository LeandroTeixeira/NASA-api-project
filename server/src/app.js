const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const CURRENT_VERSION = 'v1';

const apiV1 = require('./routes/api_v1');

const app = express();
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin (${origin}).`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1', apiV1);
app.get('/current', (_, res) => res.status(200).json({ version: CURRENT_VERSION }));

app.get('/*', (_, res) => {
  res.send(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = { app, CURRENT_VERSION };
