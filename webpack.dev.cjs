'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');
const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  output: {
    filename: 'editable.bundle.js',
    path: path.resolve(__dirname, 'dist', 'dev'),
    clean: true,
  },
});
