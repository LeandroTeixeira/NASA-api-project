const {
  getAllLaunches, scheduleNewLaunch, getLaunch, abortLaunch,
} = require('../../models/launches.model');

async function httpGetAllLaunches(_, res) {
  const launches = await getAllLaunches();
  return res.status(200).json(launches);
}
async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate);
  try {
    const addedLaunch = await scheduleNewLaunch(launch);
    return res.status(201).json(addedLaunch);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

// eslint-disable-next-line consistent-return
function validatePost(req, res, next) {
  const {
    mission,
    rocket,
    launchDate,
    target,
  } = req.body;
  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({ error: 'Missing required data.' });
  }
  const date = new Date(launchDate);
  if (date.toString() === 'Invalid Date') {
    return res.status(400).json({ error: 'Invalid Date.' });
  }
  if (date < new Date(Date.now())) {
    return res.status(400).json({ error: 'Date must be in the future.' });
  }

  next();
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const launch = await getLaunch('flightNumber', launchId);
  if (!launch) {
    return res.status(404).json({ error: 'Launch not found.' });
  }
  const aborted = await abortLaunch(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches, httpAddNewLaunch, validatePost, httpAbortLaunch,
};
