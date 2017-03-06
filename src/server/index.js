// @flow

import express from 'express';
import buildApi from './api';
import buildSwagger from './swagger';
import buildWebsite from './website';

const app = express();

buildSwagger(app);
buildApi(app);
buildWebsite(app);

app.listen(3000, () => {
  console.log('Bot listening on port 3000');
});
