import simpleMarkdown from './__mocks__/simple.md';
import { reduceTokens, convertMarkdownToVersionList } from './markdown';

describe('markdown to version list converter', () => {
  test('reduce tokens', () => {
    const tokens = [
      { type: 'heading', depth: 1, text: 'CHANGELOG' },
      { type: 'heading', depth: 2, text: '1.1.0' },
      { type: 'paragraph', text: 'Done more stuff' },
      { type: 'heading', depth: 2, text: '1.0.0' },
      { type: 'paragraph', text: 'Done stuff' },
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
    ]);
  });

  test('convert keepachangelog.com changelog to a version list', () => {});
});
