const shell = require('shelljs');
const iosDeviceModels = require('./ios-device-models');

shell.config.silent = true;

const executeCommand = command =>
  new Promise((resolve, reject) =>
    shell.exec(command, (code, stdout, stderr) => {
      if (stderr && stderr.indexOf('WARNING') === -1) return reject(stderr);
      return resolve(stdout);
    })
  );

const getDevicesUuid = () => executeCommand('idevice_id -l')
  .then(result => result.split('\n').filter(line => line));

const getDeviceInfo = uuid => executeCommand(`ideviceinfo -u ${uuid}`)
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

const getDevices = async () =>
  getDevicesUuid()
  .then(uuids =>
    Promise.all(uuids.map(uuid => getDeviceInfo(uuid))));

const installAppOnDevice = async (deviceId, ipaPath) => executeCommand(`ideviceinstaller -u ${deviceId} -i "${ipaPath}"`);

module.exports = {
  getDevices,
  installAppOnDevice,
};
