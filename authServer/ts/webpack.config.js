const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

// Given through package.json https://github.com/webpack-contrib/mini-css-extract-plugin#recommended
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    login: './src/login.ts',
    register: './src/register.ts',
  },
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: '/', // HtmlWebpackPlugin use the publicPath to prepend the urls of the injects.
    clean: true,
  },
  devServer: { // https://webpack.js.org/configuration/dev-server/
    writeToDisk: true,
    serveIndex: false,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src|protoLibrary/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [
          // For development mode (including webpack-dev-server) you can use style-loader
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({ // https://github.com/jantimon/html-webpack-plugin
      template: "../static/login.html",
      filename: "login.html",
      chunks: [login.bundle.js],
    }),
    new HtmlWebpackPlugin({
      template: "../static/register.html",
      filename: "register.html",
      chunks: [register.bundle.js],
    }),
    new HtmlWebpackTagsPlugin({ append: true, }),
    new webpack.DefinePlugin({
      'USE_TLS': process.env.USE_TLS !== undefined
    })
  ]
};
