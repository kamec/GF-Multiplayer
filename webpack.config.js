'use strict';
const webpack = require('webpack');
const path = require('path');
module.exports = function(env) {
  const config = {
    entry: './src/browser.js',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'public/js'),
      publicPath: '/js/',
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
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
    ],
    resolve: {
      modules: [
        'node_modules',
      ],
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      port: 5000,
    },
  }
  
  if (!env.Dev) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, } }));
  }
  
  return config;
}
