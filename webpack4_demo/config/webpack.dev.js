// 开发环境 config

const path = require('path');
const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const devConfig = {
    mode: 'development',
    devtool: "cheap-module-eval-sourvce-map",
    // 热更新
    devServer: {
        port: 3000,
        contentBase: path.join(__dirname, "../dist"),
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
    ]
}
module.exports = merge(baseConfig, devConfig);