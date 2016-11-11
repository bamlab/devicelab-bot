const express = require('express');
const installer = require('./installer');
const androidClient = require('./android-client');
const iosClient = require('./ios-client');

const app = express();

app.get('/install/:hockeyAppId', (req, res) =>
  installer.getMyApp(req.params.hockeyAppId)
  .then(() => res.send('Done'))
);

app.get('/devices', (req, res) =>
  Promise.all([
    androidClient.getDevices(),
    iosClient.getDevices(),
  ]).then(devices => res.json({
    android: devices[0],
    iOS: devices[1],
  }))
);

app.listen(3000, () => {
  console.log('Bot listening on port 3000');
});
