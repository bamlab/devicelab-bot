// @flow
/* eslint-disable no-undef */

declare type DeviceType = {|
  id: string,
  displayName: string,
  osVersion: string,
|};

declare type DeviceClientType = {|
  getDevices: () => Promise<Array<DeviceType>>,
  installAppOnDevice: (deviceId: string, ipaPath: string) => Promise<void>,
  uninstallAppFromDevice: (deviceId: string, apkPath: string) => Promise<void>,
|};

declare type HockeyappApiDataType = {
  title: string,
  bundle_identifier: string,
  public_identifier: string,
};

declare type HockeyappInfoType = {|
  hockeyappId: string,
  packageName: string,
|};

declare type HockeyappVersionType = {|
  appName: string,
  buildUrl: string,
  isAndroid: boolean,
|};
