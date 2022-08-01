const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

// Tikrinau kad jis undefined by default
const devMode = process.env.NODE_ENV !== "production";

// The following explains when to use which
// https://github.com/webpack-contrib/mini-css-extract-plugin#recommended
// const devMode = 'production'
// const devMode = 'development'


module.exports = {
  entry: "./src/index.ts",
  mode: process.env.NODE_ENV,
  // mode: devMode,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  // Note that webpack-dev-server runs in-memory so it won't generate any files you should see by definition. 
  // If you want actual files, you should use webpack --watch . 
  // You can run webpack --watch and webpack-dev-server in parallel if you want to get both files and HMR.
  devServer: { // https://webpack.js.org/configuration/dev-server/
    writeToDisk: true,
    // serveIndex middleware generates directory listings on viewing directories that don't have an index.html file.
    // serveIndex: false,
    staticOptions: {
      redirect: true, // Redirect to trailing “/” when the pathname is a directory
    },
  },
  // https://webpack.js.org/guides/development/
  // In order to make it easier to track down errors and warnings, 
  // JavaScript offers source maps, which map your compiled code back to your original source code.
  devtool: 'inline-source-map',
  module: {
    // With this configuration, we area defining a single entry point (src/index.ts), 
    // which is in turn linked to index.html
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
          // devMode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
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
      template:  '../static/index.html',
    }),
    new HtmlWebpackTagsPlugin({ tags: ['build.js', 'style.css'], append: true }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new webpack.DefinePlugin({
      'USE_TLS': process.env.USE_TLS !== undefined
    })
  ]
};
