var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    bundle: './index.jsx',
    vendor: ['react']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.less$/,
      loader: 'style!css!postcss!less'
    }, {
      test: /\.css/,
      loader: ExtractTextPlugin.extract('style', 'css', 'postcss')
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=25000'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.less', '.css'],
  },
  postcss: [autoprefixer],
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: process.env.NODE_ENV !== 'production'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' })
  ]
};
