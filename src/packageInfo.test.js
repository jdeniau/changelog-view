jest.mock('fs');
jest.mock('composer.lock');
import fs from 'fs';
import path from 'path';
import composerFile from 'composer.lock';
import getPackageInfo from './packageInfo';

describe('package info', () => {
  test('get package info from string', () => {
    const packageInfo = getPackageInfo('foo/bar@1.0.0');

    expect(packageInfo).toEqual({ packageName: 'foo/bar', version: '1.0.0' });
  });

  test('get package info from package.json', () => {
    // complete repository info
    jest.mock(
      'fullrepo/package.json',
      () => ({
        version: '2.0.0',
        repository: {
          url: 'git+https://github.com/fullrepo/foo.git',
        },
      }),
      { virtual: true }
    );

    // string repository info
    expect(getPackageInfo('fullrepo')).toEqual({
      packageName: 'fullrepo/foo',
      version: '2.0.0',
    });

    jest.mock(
      'stringrepo/package.json',
      () => ({
        version: '2.0.0',
        repository: 'git+https://github.com/stringrepo/foo',
      }),
      { virtual: true }
    );

    expect(getPackageInfo('stringrepo')).toEqual({
      packageName: 'stringrepo/foo',
      version: '2.0.0',
    });

    // short repository info
    expect(getPackageInfo('fullrepo')).toEqual({
      packageName: 'fullrepo/foo',
      version: '2.0.0',
    });

    jest.mock(
      'shortrepo/package.json',
      () => ({
        version: '2.0.0',
        repository: 'github:shortrepo/foo',
      }),
      { virtual: true }
    );

    expect(getPackageInfo('shortrepo')).toEqual({
      packageName: 'shortrepo/foo',
      version: '2.0.0',
    });
  });

  test('package without repository info', () => {
    jest.mock(
      'norepo/package.json',
      () => ({
        version: '2.0.0',
      }),
      { virtual: true }
    );

    expect(getPackageInfo('norepo')).toEqual(null);
  });

  test('get package info from composer.lock', () => {
    fs.__setMockFiles({
      [path.join(process.cwd(), 'composer.lock')]: JSON.stringify(composerFile),
    });

    expect(getPackageInfo('behat/transliterator')).toEqual({
      version: 'v1.2.0',
      packageName: 'Behat/Transliterator',
    });
  });
});
