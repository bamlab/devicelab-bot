// @flow

import fetch from 'node-fetch';
import { red } from 'chalk';

const HOCKEY_API_TOKEN = process.env.HOCKEY_API_TOKEN;

function checkStatus(response: Object): Object {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw response;
}

const parseJson = response => response.json();

const query = (url: string, method: string = 'GET') => {
  if (!HOCKEY_API_TOKEN) {
    console.log(red('Please specify environment variable HOCKEY_API_TOKEN.'));
    process.exit(1);
  }

  return fetch(`https://rink.hockeyapp.net/api/2${url}`, {
    method,
    headers: {
      'X-HockeyAppToken': HOCKEY_API_TOKEN,
    },
  })
  .then(checkStatus)
  .catch((error) => {
    console.log('request failed', error);
  });
};

const getAppVersionInfo = async (hockeyAppId: string): Promise<HockeyappVersionType> =>
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

let appNameToHockeyappInfo: { [title: string]: Array<HockeyappInfoType> } = {};

const getApps = (): Promise<Array<HockeyappApiDataType>> =>
  query('/apps').then(parseJson).then(result => result.apps);

const loadApps = async (): Promise<void> => {
  const apps = await getApps();
  appNameToHockeyappInfo = apps.reduce((result, app) => ({
    ...result,
    [app.title]: (result[app.title] || []).concat([{
      hockeyappId: app.public_identifier,
      packageName: app.bundle_identifier,
    }]),
  }), {});
};

const getHockeyAppInfoFromName = async (appName: string): Promise<Array<HockeyappInfoType>> => {
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
