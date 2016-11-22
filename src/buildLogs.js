// @flow

import uuid from 'node-uuid';

const logs: { [buildId: string]: Array<string> } = {};

export const createBuildLog = (): string => {
  const buildId = uuid.v4();
  logs[buildId] = [];

  return buildId;
};

export const addBuildLog = (buildId: string, log: string): void => {
  console.log(log);
  logs[buildId].push(log);
};

export const getBuildLogs = (buildId: string): Array<string> => logs[buildId];
