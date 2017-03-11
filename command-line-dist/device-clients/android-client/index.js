Object.defineProperty(exports,"__esModule",{value:true});var _this=this;

var _lodash=require('lodash');
var _androidDeviceNames=require('./android-device-names.json');var _androidDeviceNames2=_interopRequireDefault(_androidDeviceNames);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

var adb=require('adbkit').createClient();

var getDisplayName=function getDisplayName(adbDeviceProperties){
var adbDisplayName=adbDeviceProperties['ro.product.display'];
var adbBrandName=(0,_lodash.startCase)(adbDeviceProperties['ro.product.brand']);
var adbModelName=adbDeviceProperties['ro.product.model'];

return adbDisplayName||(
_androidDeviceNames2.default[adbModelName]?_androidDeviceNames2.default[adbModelName]:adbBrandName+' '+adbModelName);
};

var getDevices=function getDevices(){return regeneratorRuntime.async(function getDevices$(_context){while(1){switch(_context.prev=_context.next){case 0:return _context.abrupt('return',
adb.listDevices().
then(function(devices){return(
Promise.all(devices.map(function(device){return(
adb.getProperties(device.id).
then(function(properties){return{
id:device.id,
displayName:getDisplayName(properties),
osVersion:'Android '+properties['ro.build.version.release']};}));})));}));case 1:case'end':return _context.stop();}}},null,_this);};




var installAppOnDevice=function installAppOnDevice(deviceId,apkPath){return regeneratorRuntime.async(function installAppOnDevice$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:return _context2.abrupt('return',
adb.install(deviceId,apkPath));case 1:case'end':return _context2.stop();}}},null,_this);};

var uninstallAppFromDevice=function uninstallAppFromDevice(deviceId,apkPath){return regeneratorRuntime.async(function uninstallAppFromDevice$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:return _context3.abrupt('return',
adb.uninstall(deviceId,apkPath));case 1:case'end':return _context3.stop();}}},null,_this);};exports.default=

{
getDisplayName:getDisplayName,
getDevices:getDevices,
installAppOnDevice:installAppOnDevice,
uninstallAppFromDevice:uninstallAppFromDevice};