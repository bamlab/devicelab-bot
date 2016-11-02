const express = require('express');
const installer = require('./installer');

const app = express();

app.get('/install/:hockeyAppId', (req, res) =>
  installer.getMyApp(req.params.hockeyAppId)
  .then(() => res.send('Done'))
);

app.listen(3000, () => {
  console.log('Bot listening on port 3000');
});
