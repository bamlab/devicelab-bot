// @flow

import 'babel-polyfill';

import program from 'commander';
import { blue, green, gray } from 'chalk';
import installer from '../installer';
import { androidClient, iosClient } from '../device-clients';

program
.command('install <hockeyAppName>')
.description('Install Hockey app on connected devices')
.action(hockeyAppName => installer.installAppByName('', hockeyAppName));

const displayDevices = (deviceClient: DeviceClientType, colorize: (text: string) => string) =>
  deviceClient.getDevices()
  .then(devices => devices.map(device => console.log(`${colorize(device.displayName)} (${device.osVersion}) - ${gray(device.id)}`)))
;

program
.command('devices')
.description('List connected devices')
.action(() => {
  displayDevices(androidClient, green);
  displayDevices(iosClient, blue);
});

program.parse(process.argv);
