import { extractNextLink } from './github-tools';

describe('github tools', () => {
  test('next link extractor', () => {
    const linkHeader =
      '<https://api.github.com/repositories/3678731/releases?page=2>; rel="next", <https://api.github.com/repositories/3678731/releases?page=2>; rel="last"';

    expect(extractNextLink(linkHeader)).toEqual(
      'https://api.github.com/repositories/3678731/releases?page=2'
    );

    expect(extractNextLink(null)).toBe(null);
  });
});
