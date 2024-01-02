'use strict';

const { merge } = require('webpack-merge');
const dev = require('./webpack.dev.cjs');
const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = merge(dev, {
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'],
        },
      },
    ],
  },
  mode: 'development',
  devtool: 'eval',
  output: {
    filename: 'editable.bundle.js',
    path: path.resolve(__dirname, 'dist', 'dev-jquery'),
    clean: true,
  },
});
