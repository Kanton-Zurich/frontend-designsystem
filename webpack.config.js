const defaults = require('@unic/estatico-webpack/webpack.config.js');
const env = require('minimist')(process.argv.slice(2));
const merge = require('lodash.merge');
const path = require('path');

module.exports = [
  merge({}, defaults, {
    entry: {
      head: './src/assets/js/head.ts',
      main: './src/assets/js/main.ts',
    },
    output: {
      path: path.resolve('./dist/assets/js'),
      filename: `[name]${env.dev ? '' : '.min'}.js`,
      chunkFilename: `async/[name]${env.dev ? '' : '.min'}.js`,
      publicPath: '/assets/js/',
    },
    mode: env.dev ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /(\.ts)$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.jsx'],
    },
  }),
  {
    entry: {
      dev: './src/preview/assets/js/dev.ts',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      path: path.resolve('./dist/preview/assets/js'),
      filename: `[name].js`,
    },
    mode: 'development',
  },
];
