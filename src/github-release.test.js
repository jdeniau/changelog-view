import webpackReleases from './__mocks__/webpack-releases.json';
import { convertGithubReleasesToVersionList } from './github-release';

describe('Github releases', () => {
  test('convert simple markdown to a version list', () => {
    const webpackVersionList = convertGithubReleasesToVersionList(
      webpackReleases
    );
    expect(webpackVersionList[0].version).toEqual('3.4.1');
    expect(webpackVersionList[0].content).toEqual(
      '# Bugfixes:\r\n\r\n* fix incorrect warnings about exports when using the DllReferencePlugin'
    );

    // sorted versions
    expect(webpackVersionList.map(v => v.version)).toEqual([
      '3.4.1',
      '3.4.0',
      '3.3.0',
      '3.2.0',
      '3.1.0',
      '3.0.0',
      '3.0.0-rc.2',
      '3.0.0-rc.1',
      '3.0.0-rc.0',
      '2.7.0',
      '2.6.1',
      '2.6.0',
      '2.5.1',
      '2.5.0',
      '2.4.1',
      '2.4.0',
      '2.3.3',
      '2.3.2',
      '2.3.1',
      '2.3.0',
      '2.2.1',
      '2.2.0',
      '2.2.0-rc.7',
      '2.2.0-rc.6',
      '2.2.0-rc.5',
      '2.2.0-rc.4',
      '2.2.0-rc.3',
      '2.2.0-rc.2',
      '2.2.0-rc.1',
      '1.15.0',
    ]);
  });
});
