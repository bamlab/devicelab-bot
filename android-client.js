#!/usr/bin/env node

const adb = require('adbkit').createClient();

const wakeUpDevice = deviceId => adb.shell(deviceId, 'input keyevent KEYCODE_WAKEUP');

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const unlockDevice = (deviceId, code) =>
  delay(2000)
  .then(() => adb.shell(deviceId, 'input keyevent 66'))
  .then(() => delay(2000))
  .then(() => adb.shell(deviceId, `input text 170892`))
  .then(() => delay(2000))
  .then(() => adb.shell(deviceId, 'input keyevent 66'));

const runAppOnDevice = (deviceId, packageName) => adb.shell(deviceId, `monkey -p ${packageName} 1`);

const getDevices = () =>
  adb.listDevices()
  .then(devices =>
    Promise.all(devices.map(device =>
      adb.getProperties(device.id)
      .then(properties => ({
        id: device.id,
        displayName: properties['ro.product.display'],
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

wakeUpDevice('TA045089AJ').then(() => unlockDevice('TA045089AJ', '170892'));
