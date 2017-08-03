import https from 'https';

const FILES_TO_TEST = [
'CHANGELOG.md',
'HISTORY.md',
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
      const fileName = FILES_TO_TEST[i];
      try {
        result = await innerGetFileContent(`https://raw.githubusercontent.com/${packageName}/master/${fileName}`);

        resolve(result);
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
      .get(
        path,
        (res) => {
          let rawData = '';
          res.on('data', (chunk) => { rawData += chunk; });
          res.on('end', () => {
            if (res.statusCode >= 300) {
              reject(rawData);
            } else {
              resolve(rawData);
            }
          });
        }
      )
      .on('error', (e) => {
        // console.error(e);
        reject(e);
      })
    ;
  });

}
