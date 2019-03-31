import React from 'react';
import { Box, StdoutContext } from 'ink';

function FullWidthSeparator() {
  return (
    <StdoutContext.Consumer>
      {({ stdout }) => (
        <Box>{new Array(stdout.columns).fill('─').join('')}</Box>
      )}
    </StdoutContext.Consumer>
  );
}

export default FullWidthSeparator;
