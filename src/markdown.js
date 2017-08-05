import marked from 'marked';
import mdRenderer from 'marked-to-md';
import semver from 'semver';
import findVersions from 'find-versions';

function getTokens(content) {
  const lexer = new marked.Lexer();
  const tokens = lexer.lex(content);

  return tokens;
}

export function semverize(title) {
  title = title.replace(/(\d+\.\d+)\.x/, '$1.99999');
  title = title.replace(/(\d+)\.x/, '$1.99999.99999');

  const versions = findVersions(title, { loose: true });
  if (!versions || versions.length === 0) {
    return null;
  }

  const version = versions.sort(semver.compare).pop();

  return version;
}

function getVersionFromTitle(title) {
  const version = semverize(title);
  if (!semver.valid(version)) {

    return null;
  }

  return {
    version,
  };
}

export function reduceTokens(tokens) {
  let currentVersion = null;
  return tokens.reduce((curr, token) => {
    if (token.type === 'heading') {
      const version = getVersionFromTitle(token.text);
      if (version) {
        currentVersion = version.version;

        if (!curr[currentVersion]) {
          curr[currentVersion] = [];
        }
      }
    }

    if (currentVersion) {
      curr[currentVersion].push(token);
    }

    return curr;
  }, {});
}

export function convertMarkdownToVersionList(markdown) {
  const out = [];

  const tokens = getTokens(markdown);

  let currentVersionToken = [];
  const reducedTokens = reduceTokens(tokens);
  return Object.keys(reducedTokens).map((version) => {
    // console.log(version, tokens);
    const tokens = reducedTokens[version];
    tokens.links = {};
    const content = marked.parser(tokens, {
      renderer: mdRenderer(new marked.Renderer()),
    });

    return {
      version,
      content,
    };
  })
    .sort((a, b) => semver.compare(b.version, a.version))
  ;
}
