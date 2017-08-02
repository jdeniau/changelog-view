import https from 'https';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { findContent } from './tokens';


const CURRENT_VERSION = '0.15.0';

export default function(packageString) {
  const [match, packageName, version] = packageString.match(/(.*)@(\d+\.\d+\.\d+)/);

  const content = https.get(
    `https://raw.githubusercontent.com/${packageName}/master/CHANGELOG.md`,
    (res) => {
      // console.log(res);

      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        const content = findContent(rawData, version);
        console.log(marked.parser(content, { renderer: new TerminalRenderer() }));
      });
    }
  );

}
