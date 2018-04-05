import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

import packageInfo from './package.json';

export default {
  input: 'src/bin.js',
  output: {
    file: packageInfo.bin['changelog-view'],
    format: 'cjs',
  },
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      babelrc: false,
      presets: [
        [
          'env',
          {
            modules: false,
            targets: {
              node: '8',
            },
          },
        ],
      ],
      plugins: [
        'external-helpers',
        [
          'babel-plugin-transform-builtin-extend',
          {
            globals: ['Error', 'Array'],
          },
        ],
        [
          'transform-react-jsx',
          {
            pragma: 'h',
          },
        ],
      ],
    }),
    resolve(),
    commonjs(),
  ],
  external: [
    'fs',
    'path',
    'process',
    'https',
    'url',
    'http',
    'zlib',
    'stream',
    'buffer',
    'string_decoder',
    'util',
    'readline',
    'assert',
    'events',
    'os',
  ],
  banner: '#!/usr/bin/env node',
};
