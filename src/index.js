import React, { Component, Fragment, useState } from 'react';
import { render, Box, Color, StdoutContext, Text } from 'ink';
import { Tabs, Tab } from 'ink-tab';
import Spinner from 'ink-spinner';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { getVersionListForPackage } from './file';
import getPackageInfo from './packageInfo';
import logger from './logger';

function Markdown({ children }) {
  return marked(children, {
    renderer: new TerminalRenderer(),
  });
}

function changelogView(packageString) {
  const packageInfo = getPackageInfo(packageString);

  if (!packageInfo) {
    return new Promise((resolve, reject) => {
      reject({
        message: `*package "${packageString}" version is not well formatted*`,
        type: 'error',
      });
    });
  }

  const { packageName, version } = packageInfo;

  return getVersionListForPackage(packageName, version)
    .then(versionList => {
      if (versionList.length === 0) {
        return {
          versionList,
          message: `*No changes found for "${packageName}"*`,
          type: 'success',
          packageName,
          currentVersion: version,
        };
      } else {
        return {
          versionList,
          message: null,
          type: 'success',
          packageName,
          currentVersion: version,
        };
      }
    })
    .catch(error => {
      const message = `${
        error.message
      }\nTested files: ${error.testedProcess.map(
        f => `\n  * [${f.type}] ${f.fileName}`
      )}`;

      return {
        type: 'error',
        message,
        error,
      };
    });
}

const changelogViewCache = {};

function cachedChangelogView(packageString) {
  return new Promise((resolve, reject) => {
    if (!changelogViewCache[packageString]) {
      changelogView(packageString)
        .then(result => {
          changelogViewCache[packageString] = result;
          resolve(changelogViewCache[packageString]);
        })
        .catch(result => {
          changelogViewCache[packageString] = result;
          reject(changelogViewCache[packageString]);
        });
    } else {
      if (changelogViewCache[packageString].type === 'success') {
        resolve(changelogViewCache[packageString]);
      } else {
        reject(changelogViewCache[packageString]);
      }
    }
  });
}

function ChangelogViewResult({ result }) {
  const [currentChangelog, setCurrentChangelog] = useState(
    result.versionList && result.versionList[0]
      ? result.versionList[0].content
      : result.message
  );

  const { versionList, message } = result;

  if (!versionList) {
    return (
      <Box textWrap="wrap">
        <Markdown>{message}</Markdown>
      </Box>
    );
  }

  const items = versionList.map(version => ({
    label: version.version,
    value: version.version,
  }));

  const innerOnSelectVersion = name => {
    const selectedVersion = result.versionList.find(v => v.version === name);

    if (selectedVersion) {
      setCurrentChangelog(selectedVersion.content);
    }
  };

  return (
    <Box>
      <Box paddingRight={3}>
        <Tabs flexDirection="column" onChange={innerOnSelectVersion}>
          {versionList.map(({ version }) => (
            <Tab key={version} name={version}>
              {version}
            </Tab>
          ))}
        </Tabs>
      </Box>

      <Box textWrap="wrap">
        <Markdown>{currentChangelog}</Markdown>
      </Box>
    </Box>
  );
}

function FullWidthSeparator() {
  return (
    <StdoutContext.Consumer>
      {({ stdout }) => (
        <Box>{new Array(stdout.columns).fill('─').join('')}</Box>
      )}
    </StdoutContext.Consumer>
  );
}

class PackageListChangelog extends Component {
  constructor(props) {
    super(props);

    this.handleTabChange = this.handleTabChange.bind(this);

    this.state = {
      activeTabName: null,
      changelogViewResult: null,
    };
  }

  handleTabChange(name, activeTab) {
    this.setState({
      activeTabName: name,
      changelogViewResult: null,
    });

    cachedChangelogView(name)
      .then(result => {
        this.setState({
          changelogViewResult: result,
        });
      })
      .catch(result => {
        logger.log(result);
        this.setState({
          changelogViewResult: result,
        });
      });
  }

  render() {
    const { packageStringList } = this.props;
    const { changelogViewResult } = this.state;

    return (
      <Fragment>
        {changelogViewResult && (
          <Fragment>
            <FullWidthSeparator />
            <Box marginTop={0}>
              CHANGELOG for "{changelogViewResult.packageName}" (current
              version: `{changelogViewResult.currentVersion}`)
            </Box>

            <FullWidthSeparator />

            <Box>
              <ChangelogViewResult result={changelogViewResult} />
            </Box>
          </Fragment>
        )}

        {!changelogViewResult && (
          <Box>
            <Spinner orange /> Loading
          </Box>
        )}

        <FullWidthSeparator />

        <Tabs onChange={this.handleTabChange}>
          {packageStringList.map(packageString => (
            <Tab key={packageString} name={packageString}>
              {packageString}
            </Tab>
          ))}
        </Tabs>
        <FullWidthSeparator />
      </Fragment>
    );
  }
}

export default function packageListChangeLog(packageStringList) {
  render(<PackageListChangelog packageStringList={packageStringList} />);
}
