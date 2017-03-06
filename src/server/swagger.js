// @flow

import type {
  $Application as ApplicationType,
} from 'express';

import swagger from 'swagger-express';
import path from 'path';

export default (app: ApplicationType) => {
  app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/docs',
    swaggerJSON: '/api-docs.json',
    swaggerUI: path.join(__dirname, 'swagger-ui/'),
    basePath: 'http://localhost:3000',
    info: {
      title: 'swagger-express sample app',
      description: 'Swagger + Express = {swagger-express}',
    },
    apis: [path.join(__dirname, 'api.js')],
    middleware: () => {},
  }));
};
