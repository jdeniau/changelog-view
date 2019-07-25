import React, { PureComponent } from 'react';
import { Box, Color, Text, AppContext, StdinContext } from 'ink';
import PackageListChangelog from './component/PackageListChangelog';

class AppWithExit extends PureComponent {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    const { stdin } = this.props;

    stdin.on('keypress', this.handleKeyPress);
  }

  componentWillUnmount() {
    const { stdin } = this.props;

    stdin.removeListener('keypress', this.handleKeyPress);
  }

  handleKeyPress(ch, key) {
    if ('q' === ch) {
      this.props.onExit();
    }
  }

  render() {
    const { stdin, ...rest } = this.props;

    return (
      <Box flexDirection="column">
        <PackageListChangelog {...rest} />
        <Text italic>
          <Color gray>Press "q" or "CTRL+c" to quit.</Color>
        </Text>
      </Box>
    );
  }
}

function App(props) {
  return (
    <AppContext.Consumer>
      {({ exit }) => (
        <StdinContext.Consumer>
          {({ stdin }) => (
            <AppWithExit stdin={stdin} onExit={exit} {...props} />
          )}
        </StdinContext.Consumer>
      )}
    </AppContext.Consumer>
  );
}

export default App;
