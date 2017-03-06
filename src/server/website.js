// @flow

/**
 * @swagger
 * resourcePath: /
 * description: Device Lab Bot
 */

import type {
  $Application as ApplicationType,
  $Request as RequestType,
  $Response as ResponseType,
} from 'express';
import path from 'path';
import express from 'express';

export default (app: ApplicationType) => {
  app.get('/', (request: RequestType, response: ResponseType) => response.sendFile(path.join(__dirname, 'website-ui/index.html')));

  app.use(express.static(path.join(__dirname, 'website-ui')));
};
