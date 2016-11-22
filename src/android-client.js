#!/usr/bin/env node

const adb = require('adbkit').createClient();
const _ = require('lodash');

const getDevices = async () =>
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

const installAppOnDevice = async (deviceId, apkPath) => adb.install(deviceId, apkPath);

const uninstallAppFromDevice = async (deviceId, apkPath) => adb.uninstall(deviceId, apkPath);

module.exports = {
  getDevices,
  installAppOnDevice,
  uninstallAppFromDevice,
};
