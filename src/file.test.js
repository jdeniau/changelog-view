import nock from 'nock';
import { getFileContent } from './file';

describe('get file content', () => {
  beforeEach(() => {
    nock('https://raw.githubusercontent.com')
      .get('/packages/real/master/CHANGELOG.md')
      .reply(200, 'foo')
    ;
    nock('https://raw.githubusercontent.com')
      .get(/\/packages\/missing\//)
      .reply(404, 'file not found')
    ;

    nock('https://raw.githubusercontent.com')
      .get('/packages/missing/master/CHANGELOG.md')
      .reply(404, 'file not found')
    ;
    nock('https://raw.githubusercontent.com')
      .get('/packages/history/master/HISTORY.md')
      .reply(200, 'some history')
    ;
  });


  test('fetches file content', () => {
    expect.assertions(1);

    return getFileContent('packages/real')
      .then(content =>
        expect(content).toEqual('foo')
      )
    ;
  });

  test('file not found', () => {
    expect.assertions(1);

    return getFileContent('packages/missing')
      .then(data => { console.log( data);})
      .catch(e =>
        expect(e.message).toEqual('No file found')
      )

    ;
  });

  test('HISTORY.md is found', () => {
    expect.assertions(1);

    return getFileContent('packages/history')
      .then(content =>
        expect(content).toEqual('some history')
      )

    ;
  });
});
