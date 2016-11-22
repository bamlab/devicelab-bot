// @flow

import { createBuildLog, getBuildLogs } from './buildLogs';
import { androidClient, iosClient } from './device-clients';

const express = require('express');
const installer = require('./installer');
const hockeyAppClient = require('./hockeyapp-client');

const app = express();

app.get('/', (req, res) => res.sendfile('src/index.html'));

app.get('/install', (req, res) => {
  const buildId = createBuildLog();
  installer.installAppByName(buildId, req.query.appName, req.query.reinstall);
  res.send(buildId);
});

app.get('/devices', (req, res) =>
  Promise.all([
    androidClient.getDevices(),
    iosClient.getDevices(),
  ]).then(devices => res.json({
    android: devices[0],
    iOS: devices[1],
  }))
);

app.get('/apps', (req, res) => hockeyAppClient.getApps().then(apps => res.json(apps)));

app.get('/apps/:appName', (req, res) => hockeyAppClient.getHockeyAppInfoFromName(req.params.appName).then(apps => res.json(apps)));

app.get('/build/:buildId', (req, res) => res.json(getBuildLogs(req.params.buildId)));

app.listen(3000, () => {
  console.log('Bot listening on port 3000');
});
