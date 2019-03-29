const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/bin.js',
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'changelog-view',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
