const paths = require('./paths')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const loaders = require('./loaders')
const happyPacks = require('./happyPacks')
const webpack = require('webpack')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

export default {
  mode: 'development',
  entry: [require.resolve('./polyfills'), paths.appIndexJs],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: loaders
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: '../template/index.html' }),
    new OpenBrowserPlugin({
      url: `http://localhost:3000`
    }),
    ...happyPacks
  ],
  devtool: 'cheap-module-eval-source-map'
}
