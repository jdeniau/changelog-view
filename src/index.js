import React, { Component, Fragment } from 'react';
import { render } from 'ink';
import { Tabs, Tab } from 'ink-tab';
import Spinner from 'ink-spinner';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { getVersionListForPackage } from './file';
import getPackageInfo from './packageInfo';
import logger from './logger';

function terminalMarked(content) {
  return marked(content, {
    renderer: new TerminalRenderer(),
  });
}

function changelogView(packageString) {
  const packageInfo = getPackageInfo(packageString);

  if (!packageInfo) {
    return new Promise((resolve, reject) => {
      reject({
        message: terminalMarked(
          ` > *package "${packageString}" version is not well formatted*`
        ),
        type: 'error',
      });
    });
  }

  const { packageName, version } = packageInfo;

  return getVersionListForPackage(packageName, version)
    .then(versionList => {
      let message = terminalMarked(
        `# CHANGELOG for "${packageName}" (current version: \`${version}\`)`
      );

      if (versionList.length > 0) {
        versionList.forEach(c => {
          message = message + terminalMarked(c.content);
        });
      } else {
        message =
          message +
          terminalMarked(` > *No changes found for "${packageName}"*`);
      }

      return {
        message,
        type: 'success',
      };
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

    return (
      <div>
        <div>
          {this.state.changelogViewResult ? (
            <Fragment>{this.state.changelogViewResult.message}</Fragment>
          ) : (
            <Fragment>
              <Spinner orange /> Loading
            </Fragment>
          )}
        </div>

        <Tabs onChange={this.handleTabChange}>
          {packageStringList.map(packageString => (
            <Tab name={packageString}>{packageString}</Tab>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default function packageListChangeLog(packageStringList) {
  render(<PackageListChangelog packageStringList={packageStringList} />);
}
