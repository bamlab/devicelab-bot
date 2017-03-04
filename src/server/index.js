// @flow

import express from 'express';
import buildSwagger from './swagger';
import buildApi from './api';

const app = express();

buildSwagger(app);
buildApi(app);

app.listen(3000, () => {
  console.log('Bot listening on port 3000');
});
