var _this=this;

require('babel-polyfill');
var _buildLogs=require('./buildLogs');
var _deviceClients=require('./device-clients');

var fs=require('fs');
var download=require('download');
var hockeyAppClient=require('./hockeyapp-client');

var BUILD_FOLDER='build';

var downloadBuild=function downloadBuild(buildUrl,appName,isAndroid){
var buildFolder=BUILD_FOLDER+'/'+appName;
if(!fs.existsSync(BUILD_FOLDER)){
fs.mkdirSync(BUILD_FOLDER);
}
if(!fs.existsSync(buildFolder)){
fs.mkdirSync(buildFolder);
}
var fileName=isAndroid?'app.apk':'app.ipa';
var filePath=buildFolder+'/'+fileName;

return download(buildUrl).
then(function(fileData){
fs.writeFileSync(filePath,fileData);

return filePath;
});
};

var installAppOnDevice=function installAppOnDevice(buildId,appName,buildFilePath,
deviceClient,device){return regeneratorRuntime.async(function installAppOnDevice$(_context){while(1){switch(_context.prev=_context.next){case 0:
(0,_buildLogs.addBuildLog)(buildId,'Installing '+appName+' on '+device.displayName+' ('+device.osVersion+')');_context.prev=1;_context.next=4;return regeneratorRuntime.awrap(

deviceClient.installAppOnDevice(device.id,buildFilePath));case 4:
(0,_buildLogs.addBuildLog)(buildId,'Done installing '+appName+' on '+device.displayName+' ('+device.osVersion+')');_context.next=10;break;case 7:_context.prev=7;_context.t0=_context['catch'](1);

(0,_buildLogs.addBuildLog)(buildId,'ERROR installing '+appName+' on '+device.displayName+' ('+device.osVersion+'): '+_context.t0);case 10:case'end':return _context.stop();}}},null,_this,[[1,7]]);};



var uninstallAppFromDevice=function uninstallAppFromDevice(buildId,appName,packageName,
deviceClient,device){return regeneratorRuntime.async(function uninstallAppFromDevice$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
(0,_buildLogs.addBuildLog)(buildId,'Uninstalling '+appName+' from '+device.displayName+' ('+device.osVersion+')');_context2.prev=1;_context2.next=4;return regeneratorRuntime.awrap(

deviceClient.uninstallAppFromDevice(device.id,packageName));case 4:
(0,_buildLogs.addBuildLog)(buildId,'Done uninstalling '+appName+' from '+device.displayName+' ('+device.osVersion+')');_context2.next=10;break;case 7:_context2.prev=7;_context2.t0=_context2['catch'](1);

(0,_buildLogs.addBuildLog)(buildId,'ERROR uninstalling '+appName+' from '+device.displayName+' ('+device.osVersion+'): '+_context2.t0);case 10:case'end':return _context2.stop();}}},null,_this,[[1,7]]);};



var installApp=function installApp(buildId,hockeyAppInfo,
reinstall){var _ref,appName,buildUrl,isAndroid,buildFilePath,deviceClient,devices;return regeneratorRuntime.async(function installApp$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.prev=0;_context3.next=3;return regeneratorRuntime.awrap(

hockeyAppClient.
getAppVersionInfo(hockeyAppInfo.hockeyappId));case 3:_ref=_context3.sent;appName=_ref.appName;buildUrl=_ref.buildUrl;isAndroid=_ref.isAndroid;

(0,_buildLogs.addBuildLog)(buildId,'Downloading '+appName+' for '+(isAndroid?'Android':'iOS'));_context3.next=10;return regeneratorRuntime.awrap(
downloadBuild(buildUrl,appName,isAndroid));case 10:buildFilePath=_context3.sent;

deviceClient=isAndroid?_deviceClients.androidClient:_deviceClients.iosClient;_context3.next=14;return regeneratorRuntime.awrap(
deviceClient.getDevices());case 14:devices=_context3.sent;if(!

reinstall){_context3.next=18;break;}_context3.next=18;return regeneratorRuntime.awrap(
Promise.all(devices.map(function(device){return(
uninstallAppFromDevice(buildId,appName,hockeyAppInfo.packageName,deviceClient,device));})));case 18:_context3.next=20;return regeneratorRuntime.awrap(


Promise.all(devices.map(function(device){return(
installAppOnDevice(buildId,appName,buildFilePath,deviceClient,device));})));case 20:

(0,_buildLogs.addBuildLog)(buildId,'Done installing '+appName+' for '+(isAndroid?'Android':'iOS'));_context3.next=26;break;case 23:_context3.prev=23;_context3.t0=_context3['catch'](0);

(0,_buildLogs.addBuildLog)(buildId,'ERROR: '+_context3.t0);case 26:case'end':return _context3.stop();}}},null,_this,[[0,23]]);};



var installAppByName=function installAppByName(buildId,appName){var
reinstall=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;var hockeyAppInfos;return regeneratorRuntime.async(function installAppByName$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
(0,_buildLogs.addBuildLog)(buildId,'Installing '+appName);_context4.prev=1;_context4.next=4;return regeneratorRuntime.awrap(

hockeyAppClient.getHockeyAppInfoFromName(appName));case 4:hockeyAppInfos=_context4.sent;_context4.next=7;return regeneratorRuntime.awrap(
Promise.all(hockeyAppInfos.map(function(hockeyAppInfo){return(
installApp(buildId,hockeyAppInfo,reinstall));})));case 7:_context4.next=12;break;case 9:_context4.prev=9;_context4.t0=_context4['catch'](1);

(0,_buildLogs.addBuildLog)(buildId,'ERROR: '+_context4.t0.message);case 12:


(0,_buildLogs.addBuildLog)(buildId,'Done');case 13:case'end':return _context4.stop();}}},null,_this,[[1,9]]);};


module.exports={
installApp:installApp,
installAppByName:installAppByName};