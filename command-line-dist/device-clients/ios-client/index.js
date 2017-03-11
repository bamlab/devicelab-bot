var _this=this;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}

var shell=require('shelljs');
var iosDeviceModels=require('./ios-device-models');

shell.config.silent=true;

var executeCommand=function executeCommand(command){return(
new Promise(function(resolve,reject){return(
shell.exec(command,function(code,stdout,stderr){
if(stderr&&stderr.indexOf('WARNING')===-1)return reject(stderr);
return resolve(stdout);
}));}));};


var getDevicesUuid=function getDevicesUuid(){return executeCommand('idevice_id -l').
then(function(result){return result.split('\n').filter(function(line){return line;});});};

var getDeviceInfo=function getDeviceInfo(uuid){return executeCommand('ideviceinfo -u '+uuid).
then(function(result){return result.split('\n').reduce(function(infoObject,infoLine){
var split=infoLine.split(': ');
return _extends({},infoObject,_defineProperty({},
split[0],split[1]));

},{});}).
then(function(properties){return{
id:uuid,
displayName:iosDeviceModels[properties.ProductType].familyName,
osVersion:'iOS '+properties.ProductVersion};});};


var getDevices=function getDevices(){return regeneratorRuntime.async(function getDevices$(_context){while(1){switch(_context.prev=_context.next){case 0:return _context.abrupt('return',
getDevicesUuid().
then(function(uuids){return(
Promise.all(uuids.map(function(uuid){return getDeviceInfo(uuid);})));}));case 1:case'end':return _context.stop();}}},null,_this);};

var installAppOnDevice=function installAppOnDevice(deviceId,ipaPath){return regeneratorRuntime.async(function installAppOnDevice$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:return _context2.abrupt('return',
executeCommand('ideviceinstaller -u '+deviceId+' -i "'+ipaPath+'"'));case 1:case'end':return _context2.stop();}}},null,_this);};

var uninstallAppFromDevice=function uninstallAppFromDevice(deviceId,packageName){return regeneratorRuntime.async(function uninstallAppFromDevice$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:return _context3.abrupt('return',
executeCommand('ideviceinstaller -u '+deviceId+' -U '+packageName));case 1:case'end':return _context3.stop();}}},null,_this);};

module.exports={
getDevices:getDevices,
installAppOnDevice:installAppOnDevice,
uninstallAppFromDevice:uninstallAppFromDevice};