const express = require('express');
const {
  httpAbortLaunch, httpGetAllLaunches, httpAddNewLaunch, validatePost,
} = require('./launches.controller');

const launchesRouter = express.Router('/launches');
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', validatePost, httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;
