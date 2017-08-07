import semver from 'semver';

export function convertGithubReleasesToVersionList(jsonReleases) {
  return jsonReleases
    .map(release => ({
      version: semver.clean(release.tag_name),
      content: release.body,
    }))
    .sort((a, b) => semver.compare(b.version, a.version));
}
