const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch, validatePost } = require('./launches.controller');

const launchesRouter = express.Router('/launches');
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', validatePost, httpAddNewLaunch);

module.exports = launchesRouter;
