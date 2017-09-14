export function extractNextLink(linkHeader) {
  if (!linkHeader) {
    return null;
  }

  const matches = linkHeader.match(/<([^>]*)>/);

  if (matches) {
    return matches[1];
  }
}
