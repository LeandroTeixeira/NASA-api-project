const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches() {
  const launchList = await launches.find({}, '-_id -__v');
  return launchList;
}

async function getLaunch(key, value) {
  const launch = await launches.findOne({ [key]: value }, '-_id -__v');
  return launch;
}

async function getLatestFlightNumber() {
  const lastLaunch = await launches.findOne().sort({ flightNumber: -1 });
  if (lastLaunch) { return lastLaunch.flightNumber; }
  return DEFAULT_FLIGHT_NUMBER;
}

async function saveLaunch(newLaunch) {
  const planet = await planets.findOne({ keplerName: newLaunch.target });
  if (!planet) throw new Error('Planet not found.');
  await launches.findOneAndUpdate(
    { flightNumber: newLaunch.flightNumber },
    newLaunch,
    { upsert: true },
  );
  const addedLaunch = await getLaunch('flightNumber', newLaunch.flightNumber);
  return addedLaunch;
}

async function abortLaunch(id) {
  await launches.updateOne(
    { flightNumber: id },
    {
      upcoming: false,
      success: false,
    },
  );
  const aborted = await getLaunch('flightNumber', id);
  return aborted;
}

async function scheduleNewLaunch({
  mission, rocket, launchDate, target,
}) {
  const flightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = {
    mission,
    rocket,
    launchDate,
    target,
    flightNumber,
    customers: ['ZTM', 'Trybe'],
    upcoming: true,
    success: true,
  };
  await saveLaunch(newLaunch);
  return newLaunch;
}

const firstLaunch = {
  flightNumber: DEFAULT_FLIGHT_NUMBER,
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
  abortLaunch, getAllLaunches, scheduleNewLaunch, getLaunch,
};
