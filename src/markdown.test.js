import simpleMarkdown from './__mocks__/simple.md';
import keepachangelog from './__mocks__/keepachangelog.md';
import { semverize, reduceTokens, convertMarkdownToVersionList } from './markdown';

describe('markdown to version list converter', () => {
  test('semverize titles', () => {
    expect(semverize('1 foo')).toBeNull();
    expect(semverize('1.0.0')).toEqual('1.0.0');
    expect(semverize('1.0.x')).toEqual('1.0.99999');
    expect(semverize('1.x')).toEqual('1.99999.99999');
    expect(semverize('This is 1.x version')).toEqual('1.99999.99999');
    expect(semverize('This is 1.2.3 version')).toEqual('1.2.3');
  });

  test('reduce tokens', () => {
    const tokens = [
      { type: 'heading', depth: 1, text: 'CHANGELOG' },
      { type: 'heading', depth: 2, text: '1.1.0' },
      { type: 'paragraph', text: 'Done more stuff' },
      { type: 'heading', depth: 2, text: '1.0.0' },
      { type: 'paragraph', text: 'Done stuff' },
      { type: 'heading', depth: 2, text: '0.x' },
      { type: 'paragraph', text: 'old unused stuff' },
    ];

    expect(reduceTokens(tokens)).toEqual({
      '1.1.0': [
        { type: 'heading', depth: 2, text: '1.1.0' },
        { type: 'paragraph', text: 'Done more stuff' },
      ],
      '1.0.0': [
        { type: 'heading', depth: 2, text: '1.0.0' },
        { type: 'paragraph', text: 'Done stuff' },
      ],
      '0.99999.99999': [
        { type: 'heading', depth: 2, text: '0.x' },
        { type: 'paragraph', text: 'old unused stuff' },
      ],
    });
  });

  test('convert simple markdown to a version list', () => {
    expect(convertMarkdownToVersionList(simpleMarkdown)).toEqual([
      {
        version: '1.1.0',
        content: '## 1.1.0\nDone more stuff\n\n',
      },
      {
        version: '1.0.0',
        content: '## 1.0.0\nDone stuff\n\n',
      },
      {
        version: '0.99999.99999',
        content: '## 0.x\nOlder stuffs\n\n',
      },
    ]);
  });

  test('convert keepachangelog.com changelog to a version list', () => {
    const kacVersions = convertMarkdownToVersionList(keepachangelog);
    expect(kacVersions[0].version).toEqual('1.0.0');
    expect(kacVersions[0].content).toEqual(`## [1.0.0] - 2017-06-20
### Added

- New visual identity by @tylerfortune8.
- Version navigation.
- Links to latest released version in previous versions.
- &quot;Why keep a changelog?&quot; section.
- &quot;Who needs a changelog?&quot; section.
- &quot;How do I make a changelog?&quot; section.
- &quot;Frequently Asked Questions&quot; section.
- New &quot;Guiding Principles&quot; sub-section to &quot;How do I make a changelog?&quot;.
- Simplified and Traditional Chinese translations from @tianshuo.
- German translation from @mpbzh &amp; @Art4.
- Italian translation from @azkidenz.
- Swedish translation from @magol.
- Turkish translation from @karalamalar.
- French translation from @zapashcanon.
- Brazilian Portugese translation from @aisamu.
- Polish translation from @amielucha.
- Russian translation from @aishek.

### Changed

- Start using &quot;changelog&quot; over &quot;change log&quot; since it&#39;s the common usage.
- Start versioning based on the current English version at 0.3.0 to help
translation authors keep things up-to-date.
- Rewrite &quot;What makes unicorns cry?&quot; section.
- Rewrite &quot;Ignoring Deprecations&quot; sub-section to clarify the ideal
scenario.
- Improve &quot;Commit log diffs&quot; sub-section to further argument against
them.
- Merge &quot;Why can’t people just use a git log diff?&quot; with &quot;Commit log
diffs&quot;
- Fix typos in Simplified Chinese and Traditional Chinese translations.
- Fix typos in Brazilian Portugese translation.
- Fix typos in Turkish translation.
- Fix typos in Czech translation.
- Fix typos in Swedish translation.
- Improve phrasing in French translation.
- Fix phrasing and spelling in German translation.

### Removed

- Section about &quot;changelog&quot; vs &quot;CHANGELOG&quot;.

`);
    expect(kacVersions[1].version).toEqual('0.3.0');
    expect(kacVersions[2].version).toEqual('0.2.0');
  });
});
