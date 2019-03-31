import React from 'react';
import { render } from 'ink';
import PackageListChangelog from './component/PackageListChangelog';

export default function packageListChangeLog(packageStringList) {
  render(<PackageListChangelog packageStringList={packageStringList} />);
}
