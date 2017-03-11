// @flow

import 'babel-polyfill';

import program from 'commander';
import installer from '../installer';

program
.command('install <appName>')
.action(appName => installer.installAppByName('', appName));

program.parse(process.argv);
