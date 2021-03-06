// @flow

import uuid from 'node-uuid';
import LRUCache from 'lru-cache';

import { includes } from 'lodash';
import { green, red } from 'chalk';

export const MAX_STORED_BUILD = 500;

const logsCache = new LRUCache({ max: MAX_STORED_BUILD });

export const createBuildLog = (): string => {
  const buildId = uuid.v4();
  logsCache.set(buildId, []);

  return buildId;
};

export const getBuildLogs = (buildId: string): Array<string> => logsCache.get(buildId);

export const addBuildLog = (buildId: string, log: string): void => {
  if (includes(log.toLowerCase(), 'error')) {
    console.log(red(log));
  } else if (includes(log.toLowerCase(), 'done')) {
    console.log(green(log));
  } else {
    console.log(log);
  }

  const buildLogs = getBuildLogs(buildId);
  if (buildLogs) {
    buildLogs.push(log);
  }
};
