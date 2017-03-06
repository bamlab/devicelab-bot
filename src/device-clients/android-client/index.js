// @flow

import { startCase } from 'lodash';
import androidDeviceNames from './android-device-names.json';

const adb = require('adbkit').createClient();

const getDisplayName = (adbDeviceProperties: AdbDeviceProperties) => {
  const adbDisplayName = adbDeviceProperties['ro.product.display'];
  const adbBrandName = startCase(adbDeviceProperties['ro.product.brand']);
  const adbModelName = adbDeviceProperties['ro.product.model'];

  return adbDisplayName
    || (androidDeviceNames[adbModelName] ? androidDeviceNames[adbModelName] : `${adbBrandName} ${adbModelName}`);
};

const getDevices = async (): Promise<Array<DeviceType>> =>
  adb.listDevices()
  .then(devices =>
    Promise.all(devices.map(device =>
      adb.getProperties(device.id)
      .then(properties => ({
        id: device.id,
        displayName: getDisplayName(properties),
        osVersion: `Android ${properties['ro.build.version.release']}`,
      }))
    ))
  );

const installAppOnDevice = async (deviceId: string, apkPath: string): Promise<void> =>
  adb.install(deviceId, apkPath);

const uninstallAppFromDevice = async (deviceId: string, apkPath: string): Promise<void> =>
  adb.uninstall(deviceId, apkPath);

export default {
  getDisplayName,
  getDevices,
  installAppOnDevice,
  uninstallAppFromDevice,
};
