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
import { sortBy, uniq } from 'lodash';

import { createBuildLog, getBuildLogs } from '../buildLogs';
import installer from '../installer';
import { androidClient, iosClient } from '../device-clients';
import hockeyAppClient from '../hockeyapp-client';

export default (app: ApplicationType) => {
  /**
   * @swagger
   * path: /install
   * operations:
   *   -  httpMethod: GET
   *      summary: Install app by Hockey app name
   *      notes: Returns a build id
   *      nickname: Install
   *      parameters:
   *        - name: appName
   *          description: Hockey App Name
   *          paramType: query
   *          required: true
   *          dataType: string
   *        - name: reinstall
   *          description: If true, app will be uninstalled from devices first
   *          paramType: query
   *          required: false
   *          dataType: boolean
   */
  app.get('/install', (request: RequestType, response: ResponseType) => {
    const buildId = createBuildLog();
    installer.installAppByName(buildId, request.query.appName, !!request.query.reinstall);
    response.send(buildId);
  });

  /**
   * @swagger
   * path: /devices
   * operations:
   *   -  httpMethod: GET
   *      summary: Get devices info
   *      nickname: Get Devices
   */
  app.get('/devices', (request: RequestType, response: ResponseType) =>
    Promise.all([
      androidClient.getDevices(),
      iosClient.getDevices(),
    ]).then(devices => response.json({
      android: devices[0],
      iOS: devices[1],
    }))
  );

  /**
   * @swagger
   * path: /apps
   * operations:
   *   -  httpMethod: GET
   *      summary: Get apps available for Download
   *      nickname: Get Apps
   */
  app.get('/apps', (request: RequestType, response: ResponseType) => hockeyAppClient.getApps().then(apps => response.json(apps)));

  /**
   * @swagger
   * path: /app-names
   * operations:
   *   -  httpMethod: GET
   *      summary: Get app names available for Download
   *      nickname: Get App Namess
   */
  app.get('/app-names', (request: RequestType, response: ResponseType) => hockeyAppClient.getApps().then(apps => response.json(sortBy(uniq(apps.map(appInfo => appInfo.title))))));

  /**
   * @swagger
   * path: /apps/{appName}
   * operations:
   *   -  httpMethod: GET
   *      summary: Get app info by app name
   *      nickname: Get App Info
   *      parameters:
   *        - name: appName
   *          description: Hockey App Name
   *          paramType: path
   *          required: true
   *          dataType: string
   */
  app.get('/apps/:appName', (request: RequestType, response: ResponseType) =>
    hockeyAppClient.getHockeyAppInfoFromName(request.params.appName)
    .then(apps => response.json(apps))
    .catch((error: Error) => response.status(400).send(error.message))
  );

  /**
   * @swagger
   * path: /build/{buildId}
   * operations:
   *   -  httpMethod: GET
   *      summary: Get build logs by build if
   *      nickname: Get Build Logs
   *      parameters:
   *        - name: buildId
   *          description: Build id
   *          paramType: path
   *          required: true
   *          dataType: int
   */
  app.get('/build/:buildId', (request: RequestType, response: ResponseType) => response.json(getBuildLogs(request.params.buildId)));
};
