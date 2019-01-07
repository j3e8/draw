const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackWriteStatsPlugin = require('webpack-write-stats-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  cache: true,
  context: path.resolve(__dirname, 'src/'),
  devtool: 'cheap-module-source-map', // React 16's suggestion: https://reactjs.org/docs/cross-origin-errors.html#webpack
  entry: {
    main: path.resolve(__dirname, 'src/main.js'),
  },
  mode: isProduction ? 'production' : 'development',
  output: {
    filename: 'bundle-[name].js',
    chunkFilename: 'bundle-[name].js',
    path: path.resolve(__dirname, `www`),
    publicPath: `/`,
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve(__dirname, 'src/'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "bundle-main.css",
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
      },
    }),
    new WebpackWriteStatsPlugin(path.resolve(__dirname, 'config/webpack.json'), {
      chunks: false,
      modules: false,
    }),
    !isProduction ? new ProgressBarPlugin() : null,
    !isProduction ? new WebpackNotifierPlugin({ alwaysNotify: true }) : null,
  ].filter(i => i),
};


if (isProduction) {
  // Hashing of this kind happens only in prod.
  module.exports.output.filename = '[name]-bundle-[hash].js';
}
