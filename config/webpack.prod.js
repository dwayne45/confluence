// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

const C = require('./webpack.constants.js');
const common = require('./webpack.common.js');

const execSync = require('child_process').execSync;
execSync(`mkdir -p "${C.FOAM_BIN_TMP_DIR}"`);
execSync(`node '${C.FOAM_DIR}/tools/build.js'  ${C.FOAM_FLAGS} "${C.FOAM_BIN_TMP_PATH}"`);

module.exports = merge(common, {
  devtool: false,
  mode: 'production',
  module: {
    rules: [
      {
        test: C.ES6_REG_EXP,
        use: [
          {
            loader: 'babel-loader',
            options: C.ES6_LOADER_OPTIONS_PROD,
          },
        ],
      },
      {
        test: C.FOAM_BIN_REG_EXP,
        use: [
          {
            loader: 'babel-loader',
            options: {
              comments: false,
              plugins: [
                'transform-es2015-block-scoping',
                'transform-es2015-arrow-functions',
                'transform-es2015-template-literals',
                ['transform-es2015-modules-commonjs', {strict: false}],
              ],
              parserOpts: {strictMode: false},
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true,
          mangle: false,
          output: {comments: false},
        },
      }),
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
});
