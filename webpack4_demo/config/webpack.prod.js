// 生产环境 config

const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Opti = require('optimize-css-assets-webpack-plugin');
const Terser = require('terser-webpack-plugin'); //引入压缩js代码的插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //代码包分析工具
 
const prodConfig = {
    mode: 'production',
    devtool: 'none', //不需要调试
    optimization: {
        minimizer: [
            new Opti({}),
            new Terser({})
        ]
    },
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [
                    // {
                    //     loader: "style-loader", //create style nodes from JS strings,不配置这个无法在html中生效
                    // },
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader", //translates CSS into CommmonJS
                    },
                    {
                        loader: "postcss-loader", //FIXME 其实不懂这是啥
                        options: {
                            postcssOptions: {},
                        },
                    },
                    {
                        loader: "less-loader", //compiles Less to CSS
                        options: {
                            lessOptions: {
                                strictMath: true,
                            },
                        },
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[hash:5].css"
        }),
        new BundleAnalyzerPlugin()
    ]
}
module.exports = merge(baseConfig, prodConfig);