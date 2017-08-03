#!/usr/bin/env node

import minimist from 'minimist';
import packageListChangeLog from './';

const packages = [];
const currentVersion = null;

var args = minimist(
  process.argv.slice(2),
  {
    alias: {
      help: 'h',
    },
  }
);

if (args.help || args._.length === 0) {
  // If they didn't ask for help, then this is not a "success"
  var log = args.help ? console.log : console.error
  log('Usage: changelog-view <package@currentVersion> [<package@currentVersion> ...]')
  log('')
  log('  See changelogs for your dependencies.')
  log('')
  log('Options:')
  log('')
  log('  -h, --help     Display this usage info')
  process.exit(args.help ? 0 : 1)
} else {
  go(args);
}

function go(args) {
  packageListChangeLog(args._);
}
