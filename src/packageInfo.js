const GITHUB_REPO_REGEX = /github(?:.com)?[\/:](.*\/[^.]*)/;

export default function getPackageInfo(packageString) {
  let out = getPackageInfoFromString(packageString);

  if (out) {
    return out;
  }

  out = getPackageInfoFromPackage(packageString);

  return out;
}

function getPackageInfoFromPackage(packageString) {
  const packageInfo = require(`${packageString}/package.json`);

  if (packageInfo) {
    const repository = packageInfo.repository;
    if (!repository) {
      return null;
    }
    const url = typeof repository === 'string' ? repository : repository.url;

    const repo = url.match(GITHUB_REPO_REGEX);

    return {
      version: packageInfo.version,
      packageName: repo && repo[1],
    };
  }

  return null;
}

function getPackageInfoFromString(packageString) {
  const matches = packageString.match(/(.*)@(\d+\.\d+\.\d+)/);
  if (matches) {
    const [match, packageName, version] = matches;

    return {
      packageName,
      version,
    };
  }
}
