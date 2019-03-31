import React, { Component, Fragment } from 'react';
import { render, Box } from 'ink';
import { Tabs, Tab } from 'ink-tab';
import Spinner from 'ink-spinner';
import FullWidthSeparator from './FullWidthSeparator';
import ChangelogViewResult from './ChangelogViewResult';
import getPackageInfo from '../packageInfo';
import { getVersionListForPackage } from '../file';
import logger from '../logger';

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

export default PackageListChangelog;
