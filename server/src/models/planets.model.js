/* eslint-disable camelcase */
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const parser = parse({
  comment: '#',
  columns: true,
});
const results = [];

async function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler_data.csv'));

    function isHabitablePlanet({ koi_disposition, koi_insol, koi_prad }) {
      return koi_disposition === 'CONFIRMED'
  && koi_insol > 0.36 && koi_insol < 1.11
  && koi_prad < 1.6;
    }

    stream.pipe(parser);

    parser.on('data', (data) => {
      if (isHabitablePlanet(data)) {
        results.push(data);
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

function getAllPlanets() {
  return results;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
