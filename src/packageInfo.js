import fs from 'fs';
import path from 'path';
import process from 'process';

// const GITHUB_REPO_REGEX = /(?:github(?:.com)?)?[\/:](.*\/[^.]*)/;
const GITHUB_REPO_REGEX = /([^\/:]+\/[^.\/:]+)(?:\.git)?$/;

export default function getPackageInfo(packageString) {
  return (
    getPackageInfoFromString(packageString) ||
    getPackageInfoFromComposer(packageString) ||
    getPackageInfoFromPackage(packageString)
  );
}

function getRepoNameFromUrl(url) {
  const repo = url.match(GITHUB_REPO_REGEX);

  return repo && repo[1];
}

function getPackageInfoFromPackage(packageString) {
  try {
    const packageJsonRaw = fs.readFileSync(
      path.join(process.cwd(), 'node_modules', packageString, 'package.json'),
      { encoding: 'utf8' }
    );

    const packageInfo = JSON.parse(packageJsonRaw);

    if (packageInfo) {
      const repository = packageInfo.repository;
      if (!repository) {
        return null;
      }
      const url = typeof repository === 'string' ? repository : repository.url;

      return {
        version: packageInfo.version,
        packageName: getRepoNameFromUrl(url),
      };
    }
  } catch (e) {
    return null;
  }
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

function getPackageInfoFromComposer(packageString) {
  try {
    const composerRaw = fs.readFileSync(
      path.join(process.cwd(), 'composer.lock'),
      { encoding: 'utf8' }
    );

    const composerInfo = JSON.parse(composerRaw);

    const packages = composerInfo.packages.concat(
      composerInfo['packages-dev'] || []
    );
    const packageInfo = packages.find(
      packageDetail => packageDetail.name === packageString
    );

    if (packageInfo) {
      return {
        packageName: getRepoNameFromUrl(packageInfo.source.url),
        version: packageInfo.version,
      };
    }
  } catch (e) {
    return null;
  }
}
