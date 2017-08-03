import { titleMatchCurrentVersion } from './tokens';

describe('title matcher', () => {
  test('matching titles', () => {
    const matchingTitles = [
      { title: 'foo [1.0.0] - 2017-01-01', version: '1.0.0', match: true },
      { title: '[1.0.0] - 2017-01-01', version: '1.0.0', match: true },
      { title: '[1.1.0] - 2017-01-01', version: '1.0.0', match: false },
      { title: '[1.1.0] - 2017-01-01', version: '', match: false },
      { title: '', version: '1.0.0', match: false },
      { title: '0.14.x', version: '0.14.0', match: true },
      { title: '0.14.x', version: '0.14.1', match: true },
      { title: '0.14.x', version: '0.15.0', match: false },
      { title: '1.x', version: '0.14.0', match: false },
      { title: '1.x', version: '1.0.0', match: true },
      { title: '1.x', version: '1.2.0', match: true },
      { title: '1.x', version: '2.0.0', match: false },
    ];

    matchingTitles.forEach(token => {
      expect(titleMatchCurrentVersion(token.title, token.version)).toBe(token.match);
    })
  })
});
