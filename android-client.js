#!/usr/bin/env node

const adb = require('adbkit').createClient();
const _ = require('lodash');

const getDevices = () =>
  adb.listDevices()
  .then(devices =>
    Promise.all(devices.map(device =>
      adb.getProperties(device.id)
      .then(properties => ({
        id: device.id,
        displayName: properties['ro.product.display'] || `${_.startCase(properties['ro.product.brand'])} ${properties['ro.product.model']}`,
        osVersion: `Android ${properties['ro.build.version.release']}`,
      }))
    ))
  );

const installAppOnDevices = (apkPath, appName) =>
  getDevices().then(devices => Promise.all(devices.map((device) => {
    console.log(`Installing ${appName} on ${device.displayName} (${device.osVersion})`);
    return adb.install(device.id, apkPath);
  })));

module.exports = {
  getDevices,
  installAppOnDevices,
};
