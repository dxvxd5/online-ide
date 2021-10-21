const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(path.resolve(), 'build'),
    },
    historyApiFallback: true,
    port: 3000,
    host: 'localhost',
  },
});
