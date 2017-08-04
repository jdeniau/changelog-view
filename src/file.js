import https from 'https';

const FILES_TO_TEST = [
  {
    type: 'github-file',
    fileName: 'CHANGELOG.md',
  },
  {
    type: 'github-file',
    fileName: 'HISTORY.md',
  },
];

class NoFileFoundError extends Error {
  constructor(message, testedFiles) {
    super(message);
    this.testedFiles = testedFiles;
  }
}

export function getFileContent(packageName) {
  return new Promise(async (resolve, reject) => {
    let result;

    for (let i = 0; i < FILES_TO_TEST.length; i++) {
      const fileToTest = FILES_TO_TEST[i];
      const fileName = fileToTest.fileName;

      try {
        switch (fileToTest.type) {
          case 'github-file':
            result = await innerGetFileContent(
              `https://raw.githubusercontent.com/${packageName}/master/${fileName}`
            );

            resolve(result);
            break;

          default:
            const msg = `Unable to determine file type to test: "${fileToTest.type}"`;
            console.warn(msg);
            throw new Error(msg);
            break;
        }
      } catch (e) {
        continue;
      }
    }

    reject(new NoFileFoundError('No file found', FILES_TO_TEST));
  });
}

function innerGetFileContent(path) {
  return new Promise((resolve, reject) => {
    https
      .get(path, res => {
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 300) {
            reject(rawData);
          } else {
            resolve(rawData);
          }
        });
      })
      .on('error', e => {
        // console.error(e);
        reject(e);
      });
  });
}
