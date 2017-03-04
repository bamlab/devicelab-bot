// @flow

/**
 * @swagger
 * resourcePath: /
 * description: Device Lab Bot
 */

import { createBuildLog, getBuildLogs } from '../buildLogs';
import installer from '../installer';
import { androidClient, iosClient } from '../device-clients';
import hockeyAppClient from '../hockeyapp-client';

export default (app: any) => {
  app.get('/', (req, res) => res.sendfile('src/index.html'));

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
  app.get('/install', (req, res) => {
    const buildId = createBuildLog();
    installer.installAppByName(buildId, req.query.appName, req.query.reinstall);
    res.send(buildId);
  });

  /**
   * @swagger
   * path: /devices
   * operations:
   *   -  httpMethod: GET
   *      summary: Get devices info
   *      nickname: Get Devices
   */
  app.get('/devices', (req, res) =>
    Promise.all([
      androidClient.getDevices(),
      iosClient.getDevices(),
    ]).then(devices => res.json({
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
  app.get('/apps', (req, res) => hockeyAppClient.getApps().then(apps => res.json(apps)));

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
  app.get('/apps/:appName', (req, res) =>
    hockeyAppClient.getHockeyAppInfoFromName(req.params.appName)
    .then(apps => res.json(apps))
    .catch((error: Error) => res.status(400).send(error.message))
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
  app.get('/build/:buildId', (req, res) => res.json(getBuildLogs(req.params.buildId)));
};
