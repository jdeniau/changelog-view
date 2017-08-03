import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { findContent } from './tokens';
import { getFileContent } from './file';


const CURRENT_VERSION = '0.15.0';

export default function(packageString) {
  const matches = packageString.match(/(.*)@(\d+\.\d+\.\d+)/);

  if (!matches) {
    console.error(`package "${packageString}" version is not well formatted`);
    process.exit(1);
  }

  const [match, packageName, version] = matches;

  const rawData = getFileContent(packageName).then(rawData => {
    const content = findContent(rawData, version);
    console.log(marked.parser(content, { renderer: new TerminalRenderer() }));
  });

}
