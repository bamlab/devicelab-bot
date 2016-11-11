const shell = require('shelljs');

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
    displayName: properties.ProductType,
    osVersion: `iOS ${properties.ProductVersion}`,
  }));

const getDevices = () =>
  getDevicesUuid()
  .then(uuids =>
    Promise.all(uuids.map(uuid => getDeviceInfo(uuid))));

const installAppOnDevices = ipaPath =>
  getDevices().then(devices => Promise.all(devices.map((device) => {
    console.log(`Installing ${ipaPath} on ${device.displayName} (${device.osVersion})`);
    return executeCommand(`ideviceinstaller -u ${device.id} -i "${ipaPath}"`);
  })));

module.exports = {
  getDevices,
  installAppOnDevices,
};
