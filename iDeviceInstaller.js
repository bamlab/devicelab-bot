const shell = require('shelljs');

const executeCommand = command =>
  new Promise((resolve, reject) =>
    shell.exec(command, (code, stdout, stderr) => {
      if (stderr && stderr.indexOf('WARNING') === -1) return reject(stderr);
      return resolve(stdout);
    })
  );

const getDevicesUuid = () => executeCommand('idevice_id -l')
  .then(result => result.split('\n').filter(line => line));

const installIpaOnDevices = ipaPath =>
  getDevicesUuid().then(deviceIds =>
    Promise.all(deviceIds.map(uuid => executeCommand(`ideviceinstaller -u ${uuid} -i "${ipaPath}"`))));

module.exports = {
  installIpaOnDevices,
};
