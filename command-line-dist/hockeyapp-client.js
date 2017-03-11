var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _this=this;

var _nodeFetch=require('node-fetch');var _nodeFetch2=_interopRequireDefault(_nodeFetch);
var _chalk=require('chalk');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}

var HOCKEY_API_TOKEN=process.env.HOCKEY_API_TOKEN;

if(!HOCKEY_API_TOKEN){
console.log((0,_chalk.red)('Please specify environment variable HOCKEY_API_TOKEN.'));
process.exit(1);
}

function checkStatus(response){
if(response.status>=200&&response.status<300){
return response;
}

throw response;
}

var parseJson=function parseJson(response){return response.json();};

var query=function query(url){var method=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'GET';return(
(0,_nodeFetch2.default)('https://rink.hockeyapp.net/api/2'+url,{
method:method,
headers:{
'X-HockeyAppToken':HOCKEY_API_TOKEN}}).


then(checkStatus).
catch(function(error){
console.log('request failed',error);
}));};

var getAppVersionInfo=function getAppVersionInfo(hockeyAppId){return regeneratorRuntime.async(function getAppVersionInfo$(_context){while(1){switch(_context.prev=_context.next){case 0:return _context.abrupt('return',
query('/apps/'+hockeyAppId+'/app_versions?include_build_urls=true').
then(parseJson).
then(function(app){
var appName=app.app_versions[0].title;
var buildUrl=app.app_versions[0].build_url;
var isAndroid=buildUrl.indexOf('format=apk')!==-1;

return{
appName:appName,
buildUrl:buildUrl,
isAndroid:isAndroid};

}));case 1:case'end':return _context.stop();}}},null,_this);};

var appNameToHockeyappInfo={};

var getApps=function getApps(){return(
query('/apps').then(parseJson).then(function(result){return result.apps;}));};

var loadApps=function loadApps(){var apps;return regeneratorRuntime.async(function loadApps$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return regeneratorRuntime.awrap(
getApps());case 2:apps=_context2.sent;
appNameToHockeyappInfo=apps.reduce(function(result,app){return _extends({},
result,_defineProperty({},
app.title,(result[app.title]||[]).concat([{
hockeyappId:app.public_identifier,
packageName:app.bundle_identifier}])));},

{});case 4:case'end':return _context2.stop();}}},null,_this);};


var getHockeyAppInfoFromName=function getHockeyAppInfoFromName(appName){var appInfo;return regeneratorRuntime.async(function getHockeyAppInfoFromName$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
appInfo=appNameToHockeyappInfo[appName];if(

appInfo){_context3.next=7;break;}_context3.next=4;return regeneratorRuntime.awrap(
loadApps());case 4:
appInfo=appNameToHockeyappInfo[appName];if(

appInfo){_context3.next=7;break;}throw(
new Error('App '+appName+' could not be found'));case 7:return _context3.abrupt('return',



appInfo);case 8:case'end':return _context3.stop();}}},null,_this);};



module.exports={
getAppVersionInfo:getAppVersionInfo,
getApps:getApps,
getHockeyAppInfoFromName:getHockeyAppInfoFromName};