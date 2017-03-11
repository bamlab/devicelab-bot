

require('babel-polyfill');

var _commander=require('commander');var _commander2=_interopRequireDefault(_commander);
var _installer=require('../installer');var _installer2=_interopRequireDefault(_installer);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

_commander2.default.
command('install <appName>').
action(function(appName){return _installer2.default.installAppByName('',appName);});

_commander2.default.parse(process.argv);