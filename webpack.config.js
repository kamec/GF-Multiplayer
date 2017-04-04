'use strict';
const webpack = require('webpack');
const path = require('path');

module.exports = function(env) {
  return {
    context: path.resolve(__dirname, 'src'),
    entry: './browser.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'index.js'
    },

    watch: env.Dev,

    watchOptions: {
      aggregateTimeout: 100
    },

    devtool: env.Dev ? 'cheap-inline-module-source-map' : null,
    plugins: [new webpack.NoEmitOnErrorsPlugin()],

    resolve: {
      modules: [
      'node_modules',
      path.resolve(__dirname, 'public'),
    ],
      extensions: ['.js'],
    },

    devServer: {
      contentBase: path.join(__dirname, 'public'),
      port: 5000,
    },
  }
}
