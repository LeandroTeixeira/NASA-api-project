const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: latestFlightNumber,
  mission: 'Kepler Exploration x',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['NASA', 'ZTM'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch({
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
  launches.set(
    latestFlightNumber,
    newLaunch,
  );
  return newLaunch;
}

module.exports = { getAllLaunches, addNewLaunch };
