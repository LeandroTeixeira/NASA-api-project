/* eslint-disable camelcase */
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

const parser = parse({
  comment: '#',
  columns: true,
});

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch (err) {
    console.error(`Error saving planet to mongoDB: ${err}`);
  }
}

async function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler_data.csv'));

    function isHabitablePlanet({ koi_disposition, koi_insol, koi_prad }) {
      return koi_disposition === 'CONFIRMED'
  && koi_insol > 0.36 && koi_insol < 1.11
  && koi_prad < 1.6;
    }

    stream.pipe(parser);

    parser.on('data', async (data) => {
      if (isHabitablePlanet(data)) {
        await savePlanet(data);
      }
    });
    parser.on('error', (error) => {
      console.log(error);
      reject(error);
    });

    parser.on('end', () => {
      resolve();
    });
  });
}

async function getAllPlanets() {
  const response = await planets.find({ });
  return response;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
