'use strict';
const webpack = require('webpack');
const path = require('path');

module.exports = function(env) {
  return {
    entry: './src/browser.js',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'public/js/'),
      publicPath: './js/',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, 'src')],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['es2015'],
              }
            },
          ],
        }
      ],
    },

    watch: env.Dev,

    watchOptions: {
      aggregateTimeout: 100
    },

    devtool: env.Dev ? 'cheap-inline-module-source-map' : false,

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        }
      }),
    ],

    resolve: {
      modules: [
        'node_modules',
      ],
    },

    devServer: {
      contentBase: path.join(__dirname, 'public'),
      port: 5000,
    },
  }
}
