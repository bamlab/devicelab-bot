#!/usr/bin/env node

import 'babel-polyfill';
import { addBuildLog } from './buildLogs';

const fs = require('fs');
const download = require('download');
const androidClient = require('./android-client');
const iosClient = require('./ios-client');
const hockeyAppClient = require('./hockeyapp-client');

const BUILD_FOLDER = 'build';

const downloadBuild = (buildUrl, appName, isAndroid) => {
  const buildFolder = `${BUILD_FOLDER}/${appName}`;
  if (!fs.existsSync(BUILD_FOLDER)) {
    fs.mkdirSync(BUILD_FOLDER);
  }
  if (!fs.existsSync(buildFolder)) {
    fs.mkdirSync(buildFolder);
  }
  const fileName = isAndroid ? 'app.apk' : 'app.ipa';
  const filePath = `${buildFolder}/${fileName}`;

  return download(buildUrl)
  .then((fileData) => {
    fs.writeFileSync(filePath, fileData);

    return filePath;
  });
};

const installAppOnDevice = async (buildId, appName, buildFilePath, deviceClient, device) => {
  addBuildLog(buildId, `Installing ${appName} on ${device.displayName} (${device.osVersion})`);
  try {
    await deviceClient.installAppOnDevice(device.id, buildFilePath);
    addBuildLog(buildId, `Done installing ${appName} on ${device.displayName} (${device.osVersion})`);
  } catch (err) {
    addBuildLog(buildId, `ERROR installing ${appName} on ${device.displayName} (${device.osVersion}): ${err}`);
  }
};

const installApp = async (buildId, hockeyAppId) => {
  try {
    const { appName, buildUrl, isAndroid } = await hockeyAppClient.getAppInfo(hockeyAppId);

    addBuildLog(buildId, `Downloading ${appName} for ${isAndroid ? 'Android' : 'iOS'}`);
    const buildFilePath = await downloadBuild(buildUrl, appName, isAndroid);

    const deviceClient = isAndroid ? androidClient : iosClient;
    const devices = await deviceClient.getDevices();

    await Promise.all(devices.map(device =>
      installAppOnDevice(buildId, appName, buildFilePath, deviceClient, device)));
    addBuildLog(buildId, `Done installing ${appName} for ${isAndroid ? 'Android' : 'iOS'}`);
  } catch (err) {
    addBuildLog(buildId, `ERROR: ${err}`);
  }
};

const installAppByName = async (buildId, appName) => {
  addBuildLog(buildId, `Installing ${appName}`);
  const hockeyAppIds = await hockeyAppClient.getHockeyAppIdsFromAppName(appName);
  await Promise.all(hockeyAppIds.map(hockeyAppId => installApp(buildId, hockeyAppId)));
  addBuildLog(buildId, 'Done');
};

module.exports = {
  installApp,
  installAppByName,
};
