import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'src/bin.js',
  output: {
    file: 'build/bin.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      babelrc: false,
      presets: [
        [
          'env',
          {
            modules: false,
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
      ],
    }),
    json(),
    resolve(),
    commonjs(),
  ],
  external: [
    'fs',
    'https',
    'url',
    'http',
    'zlib',
    'stream',
    'buffer',
    'string_decoder',
    'util',
  ],
  banner: '#!/usr/bin/env node',
};
