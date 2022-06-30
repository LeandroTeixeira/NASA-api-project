const express = require('express');
const { httpGetAllLaunches } = require('./launches.controller');

const launchesRouter = express.Router('/launches');
launchesRouter.get('/launches', httpGetAllLaunches);

module.exports = launchesRouter;
