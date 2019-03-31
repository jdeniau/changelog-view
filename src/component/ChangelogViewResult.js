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

export default ChangelogViewResult;
