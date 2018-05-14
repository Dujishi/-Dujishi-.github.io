const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config.js')
const fs = require('fs')
const path = require('path')
const package = require('../package.json')
const projectInfo = require('./version')

fs.open('./build/env.js', 'w', function (err, fd) {
  const buf = 'export default "test";'
  fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {})
})

module.exports = merge(webpackBaseConfig, {
  output: {
    publicPath: '//172.16.15.121:8300/' + projectInfo.version + '/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js'
  },
  plugins: [
    new cleanWebpackPlugin(['dist/*'], {
      root: path.resolve(__dirname, '../')
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vender-exten', 'vender-base'],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CopyWebpackPlugin([
      {
        from: './src/um',
        to: '../um'
      }
    ]),
    new HtmlWebpackPlugin({
      title: '小微机器人',
      favicon: './icon.ico',
      filename: '../index.html',
      template: './src/template/index.ejs',
      inject: false
    })
    // // 注释console
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     drop_debugger: true,
    //     drop_console: true
    //   }
    // })
  ]
})
