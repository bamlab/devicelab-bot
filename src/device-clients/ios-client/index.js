// @flow

const shell = require('shelljs');
const iosDeviceModels = require('./ios-device-models');

shell.config.silent = true;

const executeCommand = (command: string) =>
  new Promise((resolve, reject) =>
    shell.exec(command, (code, stdout, stderr) => {
      if (stderr && stderr.indexOf('WARNING') === -1) return reject(stderr);
      return resolve(stdout);
    })
  );

const getDevicesUuid = (): Promise<Array<string>> => executeCommand('idevice_id -l')
  .then(result => result.split('\n').filter(line => line));

const getDeviceInfo = (uuid: string): Promise<DeviceType> => executeCommand(`ideviceinfo -u ${uuid}`)
  .then(result => result.split('\n').reduce((infoObject, infoLine) => {
    const split = infoLine.split(': ');
    return Object.assign({}, infoObject, {
      [split[0]]: split[1],
    });
  }, {}))
  .then(properties => ({
    id: uuid,
    displayName: iosDeviceModels[properties.ProductType].familyName,
    osVersion: `iOS ${properties.ProductVersion}`,
  }));

const getDevices = async (): Promise<Array<DeviceType>> =>
  getDevicesUuid()
  .then(uuids =>
    Promise.all(uuids.map(uuid => getDeviceInfo(uuid))));

const installAppOnDevice = async (deviceId: string, ipaPath: string): Promise<void> =>
  executeCommand(`ideviceinstaller -u ${deviceId} -i "${ipaPath}"`);

const uninstallAppFromDevice = async (deviceId: string, packageName: string): Promise<void> =>
  executeCommand(`ideviceinstaller -u ${deviceId} -U ${packageName}`);

module.exports = {
  getDevices,
  installAppOnDevice,
  uninstallAppFromDevice,
};
