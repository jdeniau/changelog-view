import fs from 'fs';
import path from 'path';
import process from 'process';

const GITHUB_REPO_REGEX = /github(?:.com)?[\/:](.*\/[^.]*)/;

export default function getPackageInfo(packageString) {
  return getPackageInfoFromString(packageString)
  || getPackageInfoFromComposer(packageString)
  || getPackageInfoFromPackage(packageString)
  ;
}

function getRepoNameFromUrl(url) {
    const repo = url.match(GITHUB_REPO_REGEX);

  return repo && repo[1];
}

function getPackageInfoFromPackage(packageString) {
  try {
    const packageInfo = require(`${packageString}/package.json`);

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

    const packageInfo = composerInfo.packages.find(packageDetail => packageDetail.name === packageString);

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
