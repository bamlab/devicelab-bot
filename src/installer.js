#!/usr/bin/env node

const fs = require('fs');
const download = require('download');
const androidClient = require('./android-client');
const iosClient = require('./ios-client');

const args = require('yargs')
  .demand(['token'])
  .argv;
const fetch = require('node-fetch');

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const parseJson = response => response.json();

const query = (url, method) =>
  fetch(`https://rink.hockeyapp.net/api/2${url}`, {
    method: method || 'GET',
    headers: {
      'X-HockeyAppToken': args.token,
    },
  })
  .then(checkStatus)
  .catch((error) => {
    console.log('request failed', error);
  });

const BUILD_FOLDER = 'build';

const downloadBuild = (buildUrl, appName, isAndroid) => {
  const buildFolder = `${BUILD_FOLDER}/${appName}`;
  if (!fs.existsSync(BUILD_FOLDER)) {
    fs.mkdirSync(BUILD_FOLDER);
  }
  if (!fs.existsSync(buildFolder)) {
    fs.mkdirSync(buildFolder);
  }
  const fileName = isAndroid ? 'app.apk' : 'app.ipa';
  const filePath = `${buildFolder}/${fileName}`;

  return download(buildUrl)
  .then((fileData) => {
    fs.writeFileSync(filePath, fileData);

    return filePath;
  });
};

const getMyAndroidApp = (buildUrl, appName) =>
  downloadBuild(buildUrl, appName, true)
  .then(apkPath => androidClient.installAppOnDevices(apkPath, appName));


const getMyIosApp = (buildUrl, appName) =>
  downloadBuild(buildUrl, appName, false)
  .then(ipaPath => iosClient.installAppOnDevices(ipaPath, appName));

const getMyApp = appId =>
  query(`/apps/${appId}/app_versions?include_build_urls=true`)
    .then(parseJson)
    .then((app) => {
      const appName = app.app_versions[0].title;
      const buildUrl = app.app_versions[0].build_url;
      const isAndroid = buildUrl.indexOf('format=apk') !== -1;
      console.log(`Downloading ${appName} for ${isAndroid ? 'Android' : 'iOS'}`);

      return isAndroid ? getMyAndroidApp(buildUrl, appName) : getMyIosApp(buildUrl, appName);
    })
    .then(() => console.log('Done.'))
    .catch(err => console.error(err));

module.exports = {
  getMyApp,
};
