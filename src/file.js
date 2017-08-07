import https from 'https';
import fetch from 'node-fetch';
import { convertGithubReleasesToVersionList } from './github-release';
import { convertMarkdownToVersionList } from './markdown';

const TEST_PROCESSES = [
  {
    type: 'github-file',
    fileName: 'CHANGELOG.md',
  },
  {
    type: 'github-file',
    fileName: 'HISTORY.md',
  },
  {
    type: 'github-releases',
  },
];

class NoChangelogFoundError extends Error {
  constructor(message, testedProcess) {
    super(message);
    this.testedProcess = testedProcess;
  }
}

class FileNotFound extends Error {
  constructor(response) {
    super();
    this.response = response;
  }
}

export function getPackageData(packageName) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < TEST_PROCESSES.length; i++) {
      const fileToTest = TEST_PROCESSES[i];

      try {
        switch (fileToTest.type) {
          case 'github-file':
            const url = `https://raw.githubusercontent.com/${packageName}/master/${fileToTest.fileName}`;
            const ghFileResult = await innerFetch(url);

            resolve({ content: await ghFileResult.text(), type: 'markdown' });
            break;

          case 'github-releases':
            const ghReleaseResult = await innerFetch(
              `https://api.github.com/repos/${packageName}/releases`
            );

            resolve({
              content: await ghReleaseResult.json(),
              type: 'github-release',
            });
            break;

          default:
            const msg = `Unable to determine file type to test: "${fileToTest.type}"`;
            throw new Error(msg);
            break;
        }
      } catch (e) {
        if (e instanceof FileNotFound) {
          continue;
        }

        console.error(e);
        throw e;
      }
    }

    reject(new NoChangelogFoundError('No file found', TEST_PROCESSES));
  });
}

export function getVersionListForPackage(packageName) {
  return getPackageData(packageName).then(({ content, type }) => {
    switch (type) {
      case 'markdown':
        return convertMarkdownToVersionList(content);
      case 'github-release':
        return convertGithubReleasesToVersionList(content);
      default:
        const msg = `Unable to determine how to convert version list from "${type}"`;
        throw new Error(msg);
    }
  });
}

function innerFetch(url) {
  return fetch(url, {
    headers: {
      'User-Agent': 'changelog-view',
    },
  }).then(resp => {
    if (resp.status >= 300) {
      throw new FileNotFound(resp);
    }

    return resp;
  });
}
