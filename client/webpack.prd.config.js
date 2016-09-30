var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    index: './index.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
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
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('style.min.css'),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: false
      }
    }),
  ]
};
