'use strict';

const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.cjs');
const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = merge(prod, {
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
  output: {
    filename: 'editable.bundle.js',
    path: path.resolve(__dirname, 'dist', 'prod-jquery'),
    clean: true,
  },
});
