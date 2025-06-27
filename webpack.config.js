import TerserPlugin from 'terser-webpack-plugin';
import UnminifiedWebpackPlugin from 'unminified-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const env = require('minimist')(process.argv.slice(2));
import { resolve as _resolve } from 'path';

export default [
  {
    entry: {
      head: './src/assets/js/head.ts',
      main: './src/assets/js/main.ts',
      mainMinimal: './src/assets/js/mainMinimal.ts',
    },
    output: {
      path: _resolve('./dist/assets/js'),
      filename: `[name]${env.dev ? '' : '.min'}.js`,
      chunkFilename: `async/[name]${env.dev ? '' : '.min'}.js`,
      publicPath: '/assets/js/',
    },
    mode: env.dev ? 'development' : 'production',
    module: {
      rules: [
        {
          use: 'handlebars-loader',
          test: /\.hbs$/,
        },
        {
          use: 'babel-loader',
          test: /(\.js|\.jsx)$/,
          exclude: /node_modules/,
        },
        {
          use: 'ts-loader',
          test: /(\.ts)$/,
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.jsx'],
      alias: {
        handlebars: 'handlebars/runtime.js',
      },
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        // Path to bundle report file that will be generated in `static` mode.
        // Relative to bundles output directory.
        reportFilename: 'report.html',
        openAnalyzer: false,
        logLevel: 'warn',
      }),
      new UnminifiedWebpackPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_fnames: true,
        },
      })],
    },
  },
  {
    entry: {
      dev: './src/preview/assets/js/dev.ts',
    },
    module: {
      rules: [
        {
          use: 'ts-loader',
          test: /\.tsx?$/,
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      path: _resolve('./dist/preview/assets/js'),
      filename: `[name].js`,
    },
    mode: 'development',
  },
];
