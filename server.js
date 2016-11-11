const express = require('express');
const installer = require('./installer');
const androidClient = require('./android-client');

const app = express();

app.get('/install/:hockeyAppId', (req, res) =>
  installer.getMyApp(req.params.hockeyAppId)
  .then(() => res.send('Done'))
);

app.get('/devices', (req, res) =>
  androidClient.getDevices()
  .then(devices => res.json(devices))
);

app.listen(3000, () => {
  console.log('Bot listening on port 3000');
});
