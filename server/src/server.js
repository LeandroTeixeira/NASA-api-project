// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { loadPlanetsData } = require('./models/planets.model');

const app = require('./app');

const PORT = process.env.PORT || 8000;
const MONGO_URL = `mongodb+srv://nasa-api:${process.env.MONGO_PASSWORD}@cluster0.euwpkrd.mongodb.net/nasa?retryWrites=true&w=majority`;

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB Connection Ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

(async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}());
