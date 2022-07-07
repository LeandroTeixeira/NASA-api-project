const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
// const launches = new Map();
async function getAllLaunches() {
  const launchList = await launches.find({}, '-_id -__v');
  return launchList;
}

async function getLaunch(key, value) {
  const launch = await launches.find({ [key]: value }, '-_id -__v');
  return launch;
}
async function saveLaunch(newLaunch) {
  const planet = await planets.findOne({ keplerName: newLaunch.target });
  if (!planet) throw new Error('Planet not found');
  await launches.updateOne(
    { flightNumber: newLaunch.flightNumber },
    newLaunch,
    { upsert: true },
  );
  const addedLaunch = await getLaunch('flightNumber', newLaunch.flightNumber);
  return addedLaunch;
}

function abortLaunch(id) {
  const aborted = launches.get(id);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

let latestFlightNumber = 100;

async function addNewLaunch({
  mission, rocket, launchDate, target,
}) {
  ++latestFlightNumber;
  const newLaunch = {
    mission,
    rocket,
    launchDate,
    target,
    flightNumber: latestFlightNumber,
    customers: ['ZTM', 'Trybe'],
    upcoming: true,
    success: true,
  };
  const addedLaunch = await saveLaunch(newLaunch);
  return addedLaunch;
}

const firstLaunch = {
  flightNumber: latestFlightNumber,
  mission: 'Kepler Exploration x',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['NASA', 'ZTM'],
  upcoming: true,
  success: true,
};

saveLaunch(firstLaunch);

module.exports = {
  abortLaunch, getAllLaunches, addNewLaunch, getLaunch,
};
