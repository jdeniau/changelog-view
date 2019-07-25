import React from 'react';
import { render } from 'ink';
import App from './App';

export default function packageListChangeLog(packageStringList) {
  render(<App packageStringList={packageStringList} />);
}
