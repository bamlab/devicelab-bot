import { createBuildLog, getBuildLogs } from './buildLogs';

const express = require('express');
const installer = require('./installer');
const androidClient = require('./android-client');
const iosClient = require('./ios-client');
const hockeyAppClient = require('./hockeyapp-client');

const app = express();

app.get('/', (req, res) => res.sendfile('src/index.html'));

app.get('/install', (req, res) => {
  const buildId = createBuildLog();
  installer.installAppByName(buildId, req.query.appName);
  res.send(buildId);
});

app.get('/install/:hockeyAppId', (req, res) => {
  const buildId = createBuildLog();
  installer.installApp(buildId, req.params.hockeyAppId);
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

app.get('/build/:buildId', (req, res) => res.json(getBuildLogs(req.params.buildId)));

app.listen(3000, () => {
  console.log('Bot listening on port 3000');
});
