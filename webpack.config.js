
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [
    'aws-sdk',
    'fs'
  ],
  module: {
    rules: [{
      test: /\.yml$/,
      use: [{
        loader: 'json-loader'
      }, {
        loader: 'yaml-loader'
      }]
    }]
  }
};
