import React, { useState } from 'react';
import { Box } from 'ink';
import { Tabs, Tab } from 'ink-tab';
import Markdown from './Markdown';

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

  // use largest version string length for separator width
  const width = versionList.reduce(
    (acc, curr) => Math.max(acc, curr.version.length),
    0
  );

  return (
    <Box>
      <Box width={width + 7} marginRight={5}>
        <Tabs
          flexDirection="column"
          width={width + 4}
          onChange={innerOnSelectVersion}
          keyMap={{
            useTab: false,
            useNumbers: false,
          }}
        >
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

export default ChangelogViewResult;
