import { h, render, Component, Text } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import { List, ListItem } from 'ink-checkbox-list';

class Tab extends Component {
  render() {
    return <Text>{this.props.children} </Text>;

    return (
      <div>
        <div>
          {this.state.selectedItems && <Text>{this.state.selectedItems}</Text>}
        </div>
        <div>
          {this.props.items.map((item, key) => (
            <Text>
              {key !== 0 && <Text> | </Text>}
              {key === this.state.activeTab ? (
                <Text bgGreen>{item.label}</Text>
              ) : (
                <Text dim>{item.label}</Text>
              )}
            </Text>
          ))}
        </div>
        <div>
          <Text>Command: </Text>
          <TextInput
            placeholder="ploup"
            value={this.state.command}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

function Tabs({ onChange, children }) {
  return children;
}
function TabContent() {}

function TabExample() {
  return (
    <Tabs onChange={console.log}>
      {/*
      <TabContent id="foo">Foofoo</TabContent>
      <TabContent id="bar">barbar</TabContent>
      <TabContent id="baz">bazbaz</TabContent>
      */}

      <Tab for="foo">Foo</Tab>
      <Tab for="bar">Bar</Tab>
      <Tab for="baz">Baz</Tab>
    </Tabs>
  );
}

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      command: '',
      activeTab: 0,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(value) {
    this.setState({
      command: value,
    });
  }

  handleSelect(items) {
    this.setState({
      selectedItems: items,
    });
  }

  handleKeyPress(ch, key) {
    switch (key.name) {
      case 'left':
        this.setState(prevState => ({
          activeTab: Math.max(0, prevState.activeTab - 1),
        }));
        return;

      case 'right':
        this.setState(prevState => ({
          activeTab: Math.min(
            this.props.items.length - 1,
            prevState.activeTab + 1
          ),
        }));
        return;

      default:
        return;
    }
  }

  componentDidMount() {
    process.stdin.on('keypress', this.handleKeyPress);
  }

  componentWillUnmount() {
    process.stdin.removeListener('keypress', this.handleKeyPress);
  }

  render() {
    return (
      <div>
        <div>
          {this.state.selectedItems && <Text>{this.state.selectedItems}</Text>}
        </div>
        <div>
          {this.props.items.map((item, key) => (
            <Text>
              {key !== 0 && <Text> | </Text>}
              {key === this.state.activeTab ? (
                <Text bgGreen>{item.label}</Text>
              ) : (
                <Text dim>{item.label}</Text>
              )}
            </Text>
          ))}
        </div>
        <div>
          <Text>Command: </Text>
          <TextInput
            placeholder="ploup"
            value={this.state.command}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

// render(
//   <Counter
//     items={[
//       {
//         label: 'First',
//         value: 'first item',
//       },
//       {
//         label: 'Second',
//         value: 'second item',
//       },
//       {
//         label: 'Third',
//         value: 'third item',
//       },
//     ]}
//   />
// );
render(<TabExample />);
