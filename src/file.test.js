import nock from 'nock';
import { getPackageData } from './file';

function mockAllCalls(packageName) {
  nock('https://raw.githubusercontent.com')
    .get(`/${packageName}/master/CHANGELOG.md`)
    .reply(404, 'file not found');
  nock('https://raw.githubusercontent.com')
    .get(`/${packageName}/master/HISTORY.md`)
    .reply(404, 'file not found');
  nock('https://api.github.com')
    .get(`/repos/${packageName}/releases`)
    .reply(404, 'file not found');
}

describe('get file content', () => {
  beforeEach(() => {
    nock('https://raw.githubusercontent.com')
      .get('/packages/real/master/CHANGELOG.md')
      .reply(200, 'foo');

    nock('https://raw.githubusercontent.com')
      .get('/packages/history/master/HISTORY.md')
      .reply(200, '## 1.0.0\nsome history');

    nock('https://api.github.com')
      .get('/repos/packages/release/releases')
      .reply(
        200,
        '[{"tag_name": "1.4.0"},{"tag_name": "1.3.0"},{"tag_name": "1.2.0"},{"tag_name": "1.1.0"},{"tag_name": "1.0.0"}]',
        {
          Link:
            '<https://api.github.com/repositories/123/releases?page=2>; rel="next", <https://api.github.com/repositories/123/releases?page=2>; rel="last"',
        }
      );

    nock('https://api.github.com')
      .get('/repositories/123/releases?page=2')
      .reply(200, '[{"tag_name": "v0.9.0"},{"tag_name": "v0.8.0"}]');

    mockAllCalls('packages/history');
    mockAllCalls('packages/real');
    mockAllCalls('packages/missing');
    mockAllCalls('packages/release');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('fetches file content', () => {
    expect.assertions(1);

    return getPackageData('packages/real')
      .then(content => {
        console.log(content);
      })
      .catch(e => expect(e.message).toEqual('No file found'));
  });

  test('file not found', () => {
    expect.assertions(1);

    return getPackageData('packages/missing')
      .then(data => {
        console.log(data);
      })
      .catch(e => expect(e.message).toEqual('No file found'));
  });

  test('HISTORY.md is found', () => {
    expect.assertions(1);

    return getPackageData('packages/history').then(content =>
      expect(content).toEqual({
        content: '## 1.0.0\nsome history',
        type: 'markdown',
      })
    );
  });

  test('releases is found', () => {
    expect.assertions(1);

    return getPackageData('packages/release', '1.1.0').then(content =>
      expect(content).toEqual({
        content: [
          { tag_name: '1.4.0' },
          { tag_name: '1.3.0' },
          { tag_name: '1.2.0' },
          { tag_name: '1.1.0' },
          { tag_name: '1.0.0' },
        ],
        type: 'github-release',
      })
    );
  });

  test('releases is found on second page', () => {
    expect.assertions(1);

    return getPackageData('packages/release', '0.9.0').then(content =>
      expect(content).toEqual({
        content: [
          { tag_name: '1.4.0' },
          { tag_name: '1.3.0' },
          { tag_name: '1.2.0' },
          { tag_name: '1.1.0' },
          { tag_name: '1.0.0' },
          { tag_name: 'v0.9.0' },
          { tag_name: 'v0.8.0' },
        ],
        type: 'github-release',
      })
    );
  });
});
