

require('babel-polyfill');

var _commander=require('commander');var _commander2=_interopRequireDefault(_commander);
var _chalk=require('chalk');
var _installer=require('../installer');var _installer2=_interopRequireDefault(_installer);
var _deviceClients=require('../device-clients');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

_commander2.default.
command('install <appName>').
action(function(appName){return _installer2.default.installAppByName('',appName);});

var displayDevices=function displayDevices(deviceClient,colorize){return(
deviceClient.getDevices().
then(function(devices){return devices.map(function(device){return console.log(colorize(device.displayName)+' ('+device.osVersion+') - '+(0,_chalk.gray)(device.id));});}));};


_commander2.default.
command('devices').
action(function(){
displayDevices(_deviceClients.androidClient,_chalk.green);
displayDevices(_deviceClients.iosClient,_chalk.blue);
});

_commander2.default.parse(process.argv);