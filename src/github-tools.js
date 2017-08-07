export function extractNextLink(linkHeader) {
  const matches = linkHeader.match(/<([^>]*)>/);

  if (matches) {
    return matches[1];
  }
}
