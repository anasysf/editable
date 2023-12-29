'use strict';

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/index.ts',
  cache: true,
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'],
        },
      },
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
    alias: {
      '@': './src',
    },
  },
};
