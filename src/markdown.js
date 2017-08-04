import marked from 'marked';
import mdRenderer from 'marked-to-md';

function getTokens(content) {
  const lexer = new marked.Lexer();
  const tokens = lexer.lex(content);

  return tokens;
}

function getVersionFromTitle(title) {
  const titleSemVerMatch = title.match(/(\d+)(?:\.(\d+)(?:\.(\d+))?)?/);
  if (!titleSemVerMatch) {
    return null;
  }

  const [version, major, minor, patch] = titleSemVerMatch;

  return {
    version,
    major,
    minor,
    patch,
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
  return Object.entries(reducedTokens).map(([version, tokens]) => {
    // console.log(version, tokens);
    tokens.links = {};
    const content = marked.parser(tokens, {
      renderer: mdRenderer(new marked.Renderer()),
    });

    return {
      version,
      content,
    };
  });
}
