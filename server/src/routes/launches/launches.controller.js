const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(_, res) {
  return res.status(200).json(getAllLaunches());
}
function httpAddNewLaunch(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate);
  const addedLaunch = addNewLaunch(launch);
  return res.status(201).json(addedLaunch);
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

module.exports = {
  httpGetAllLaunches, httpAddNewLaunch, validatePost,
};
