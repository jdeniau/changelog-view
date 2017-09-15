import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { getVersionListForPackage } from './file';
import getPackageInfo from './packageInfo';

function changelogView(packageString) {
  const packageInfo = getPackageInfo(packageString);

  if (!packageInfo) {
    console.error(`package "${packageString}" version is not well formatted`);
    process.exit(1);
  }

  const { packageName, version } = packageInfo;

  getVersionListForPackage(packageName, version)
    .then(versionList => {
      console.log(
        marked(`# CHANGELOG for "${packageName}"`, {
          renderer: new TerminalRenderer(),
        })
      );
      versionList.forEach(c => {
        console.log(marked(c.content, { renderer: new TerminalRenderer() }));
      });
    })
    .catch(e => {
      console.error(e);
      console.error(
        `${e.message}\nTested files: ${e.testedProcess.map(
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
