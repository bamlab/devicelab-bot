import { createBuildLog, getBuildLogs } from './buildLogs';

const express = require('express');
const installer = require('./installer');
const androidClient = require('./android-client');
const iosClient = require('./ios-client');

const app = express();

app.get('/', (req, res) => res.sendfile('src/index.html'));

app.get('/install/:hockeyAppId', (req, res) => {
  const buildId = createBuildLog();
  installer.getMyApp(buildId, req.params.hockeyAppId);
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

app.get('/build/:buildId', (req, res) => res.json(getBuildLogs(req.params.buildId)));

app.listen(3000, () => {
  console.log('Bot listening on port 3000');
});
