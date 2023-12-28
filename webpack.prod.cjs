'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: true,
          compress: true,
        },
      }),
    ],
  },
  output: {
    filename: 'editable.bundle.js',
    path: path.resolve(__dirname, 'dist', 'prod'),
    clean: true,
  },
});
