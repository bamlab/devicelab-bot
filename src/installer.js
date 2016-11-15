#!/usr/bin/env node

import 'babel-polyfill';

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

const getMyApp = async (hockeyAppId) => {
  const { appName, buildUrl, isAndroid } = await hockeyAppClient.getAppInfo(hockeyAppId);

  console.log(`Downloading ${appName} for ${isAndroid ? 'Android' : 'iOS'}`);
  const buildFilePath = await downloadBuild(buildUrl, appName, isAndroid);

  const deviceClient = isAndroid ? androidClient : iosClient;
  const devices = await deviceClient.getDevices();

  for (const device of devices) {
    console.log(`Installing ${appName} on ${device.displayName} (${device.osVersion})`);
    await deviceClient.installAppOnDevice(device.id, buildFilePath);
  }
};

module.exports = {
  getMyApp,
};
