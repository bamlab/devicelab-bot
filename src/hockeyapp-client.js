#!/usr/bin/env node

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

const getAppVersionInfo = async hockeyAppId =>
  query(`/apps/${hockeyAppId}/app_versions?include_build_urls=true`)
    .then(parseJson)
    .then((app) => {
      const appName = app.app_versions[0].title;
      const buildUrl = app.app_versions[0].build_url;
      const isAndroid = buildUrl.indexOf('format=apk') !== -1;

      return {
        appName,
        buildUrl,
        isAndroid,
      };
    });

let appNameToHockeyappInfo = {};

const getApps = () =>
  query('/apps').then(parseJson).then(result => result.apps);

const loadApps = async () => {
  const apps = await getApps();
  appNameToHockeyappInfo = apps.reduce((result, app) => ({
    ...result,
    [app.title]: (result[app.title] || []).concat([{
      hockeyappId: app.public_identifier,
      packageName: app.bundle_identifier,
    }]),
  }), {});
};

const getHockeyAppInfoFromName = async (appName) => {
  let appInfo = appNameToHockeyappInfo[appName];

  if (!appInfo) {
    await loadApps();
    appInfo = appNameToHockeyappInfo[appName];

    if (!appInfo) {
      throw new Error(`App ${appName} could not be found`);
    }
  }

  return appInfo;
};


module.exports = {
  getAppVersionInfo,
  getApps,
  getHockeyAppInfoFromName,
};
