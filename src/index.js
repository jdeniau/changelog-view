import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import semver from 'semver';
import { getFileContent } from './file';
import { convertMarkdownToVersionList } from './markdown';

export function findContent(content, version) {
  return convertMarkdownToVersionList(content)
    .filter(versionContent => semver.gt(versionContent.version, version))
  ;
}

function changelogView(packageString) {
  const matches = packageString.match(/(.*)@(\d+\.\d+\.\d+)/);

  if (!matches) {
    console.error(`package "${packageString}" version is not well formatted`);
    process.exit(1);
  }

  const [match, packageName, version] = matches;

  const rawData = getFileContent(packageName)
    .then(rawData => {
      const content = findContent(rawData, version);
      console.log(
        marked(`# CHANGELOG for "${packageName}"`, {
          renderer: new TerminalRenderer(),
        })
      );
      content.forEach(c => {
      console.log(marked(c.content, { renderer: new TerminalRenderer() }));
      });
    })
    .catch(e => {
      console.error(
        `${e.message}\nTested files: ${e.testedFiles.map(
          f => `\n  * [${f.type}] ${f.fileName}`
        )}`
      );
      process.exit(1);
    });
}

export default function packageListChangeLog(packageStringList) {
  packageStringList.forEach(packageString => {
    changelogView(packageString);
  });
}
