import { createBuildLog, addBuildLog, getBuildLogs, MAX_STORED_BUILD } from './buildLogs';

describe('buildLogs', () => {
  it('has a limited stored build logs', () => {
    const firstBuildId = createBuildLog();

    expect(firstBuildId).toBeDefined();
    expect(getBuildLogs(firstBuildId)).toEqual([]);

    for (let i = 0; i < MAX_STORED_BUILD; i += 1) {
      createBuildLog();
    }

    expect(getBuildLogs(firstBuildId)).toEqual(undefined);
  });

  it('gets build logs', () => {
    const firstBuildId = createBuildLog();
    const secondBuildId = createBuildLog();

    addBuildLog(firstBuildId, 'log 1');
    addBuildLog(secondBuildId, 'log 2');
    addBuildLog(firstBuildId, 'log 3');

    expect(getBuildLogs(firstBuildId)).toEqual(['log 1', 'log 3']);
  });
});
