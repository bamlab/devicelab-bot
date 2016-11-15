import uuid from 'node-uuid';

const logs = {};

export const createBuildLog = () => {
  const buildId = uuid.v1();
  logs[buildId] = [];

  return buildId;
};

export const addBuildLog = (buildId, log) => {
  console.log(log);
  logs[buildId].push(log);
};

export const getBuildLogs = buildId => logs[buildId];
