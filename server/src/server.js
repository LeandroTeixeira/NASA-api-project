// eslint-disable-next-line import/no-extraneous-dependencies
const http = require('http');
const { loadPlanetsData } = require('./models/planets.model');

const app = require('./app');
const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

(async function startServer() {
  await mongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}());
