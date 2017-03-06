import androidClient from './index';

jest.mock('adbkit', () => ({
  createClient: () => ({}),
}));

describe('Android Client', () => {
  it('sets devices display name if present in adb properties', () => {
    expect(androidClient.getDisplayName({
      'ro.build.version.release': 'release',
      'ro.product.display': 'display',
      'ro.product.brand': 'brand',
      'ro.product.model': 'model',
    })).toEqual('display');
  });

  it('sets devices display name from devices names json if not present in adb properties', () => {
    expect(androidClient.getDisplayName({
      'ro.build.version.release': 'release',
      'ro.product.display': '',
      'ro.product.brand': 'brand',
      'ro.product.model': 'SM-N910V',
    })).toEqual('Samsung Galaxy Note4');
  });

  it('sets devices display name from model and brand if not present in adb properties or in devices names json', () => {
    expect(androidClient.getDisplayName({
      'ro.build.version.release': 'release',
      'ro.product.display': '',
      'ro.product.brand': 'brand',
      'ro.product.model': 'model',
    })).toEqual('Brand model');
  });
});
