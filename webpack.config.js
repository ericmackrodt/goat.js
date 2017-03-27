'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'goat';

let plugins = [];
let outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true, sourceMap: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function() {
    const dts = require('dts-bundle');
    dts.bundle({
      name: libraryName,
      main: './build/src/expression.parser.d.ts',
      out: './../' + libraryName + '.d.ts',
      removeSource: true,
      outputAsModuleFolder: true
    });
  });
};

plugins.push(new DtsBundlePlugin());

const config = {
  entry: __dirname + '/src/expression.parser.ts',
  devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.tsx|\.ts)$/,
        loader: 'ts-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins
};

module.exports = config;