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

const installApp = async (buildId, hockeyAppId) => {
  try {
    const { appName, buildUrl, isAndroid } = await hockeyAppClient.getAppInfo(hockeyAppId);

    addBuildLog(buildId, `Downloading ${appName} for ${isAndroid ? 'Android' : 'iOS'}`);
    const buildFilePath = await downloadBuild(buildUrl, appName, isAndroid);

    const deviceClient = isAndroid ? androidClient : iosClient;
    const devices = await deviceClient.getDevices();

    for (const device of devices) {
      addBuildLog(buildId, `Installing ${appName} on ${device.displayName} (${device.osVersion})`);
      await deviceClient.installAppOnDevice(device.id, buildFilePath);
    }
    addBuildLog(buildId, 'Done');
  } catch (err) {
    addBuildLog(buildId, `ERROR: ${err}`);
  }
};

const installAppByName = async (buildId, appName) => {
  const hockeyAppIds = await hockeyAppClient.getHockeyAppIdsFromAppName(appName);
  hockeyAppIds.forEach(hockeyAppId => installApp(buildId, hockeyAppId));
};

module.exports = {
  installApp,
  installAppByName,
};
