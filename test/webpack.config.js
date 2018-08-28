
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  externals: [ nodeExternals() ],
  module: {
    rules: [{
      test: /\.yml$/,
      use: [{
        loader: 'json-loader'
      }, {
        loader: 'yaml-loader'
      }]
    }]
  },
  mode: 'development',
  node: {
    __dirname: false
  }
};
