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

const getAppInfo = async hockeyAppId =>
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

module.exports = {
  getAppInfo,
};
