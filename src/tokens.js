import marked from 'marked';

export function titleMatchCurrentVersion(title, version) {
  if (!version) {
    return false;
  }

  const titleSemVerMatch = title.match(/(\d+)\.(\d+)\.(\d+)/);
  const semVerMatch = version.match(/(\d+)\.(\d+)\.(\d+)/);

  if (!titleSemVerMatch) {
    return false;
  }

  const [semVer, titleMajor, titleMinor, titlePatch] = titleSemVerMatch;
  const [currentSemVer, currentMajor, currentMinor, currentPatch] = semVerMatch;

  console.log(titleMajor, titleMinor, titlePatch, currentMajor, currentMinor, currentPatch);

  if (titleMajor === currentMajor || Number(titleMajor) === 'NaN') {
    if (titleMinor === currentMinor || Number(titleMinor) === 'NaN') {
      if (titlePatch === currentPatch || Number(titlePatch) === 'NaN') {
        return true;
      }
    }
  }

  return false;
}

export function findContent(content, version) {
  const outTokens = [];

  const tokens = getTokens(content);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading' && titleMatchCurrentVersion(token.text, version)) {
      break;
    }

    outTokens.push(token);
  }

  outTokens.links = tokens.links;

  return outTokens;
}

function getTokens(content) {
  const lexer = new marked.Lexer();
  const tokens = lexer.lex(content);

  return tokens;
}

