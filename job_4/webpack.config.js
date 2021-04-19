const { join, resolve } = require('path');
const { argv } = require('yargs');
const { merge } = require('webpack-merge');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //css文件单独打包
const AfterHtmlPlugin = require('./plugins/AfterHtmlPlugin');

// 1.判断打包环境
const mode = argv.mode; //取打包环境参数
const envConfig = require(`./config/webpack.${mode}.config.js`); //根据打包环境获取相应配置文件
console.log(mode);

// 2.遍历入口文件
const entryFiles = glob.sync('./src/web/views/**/*.entry.js');
console.log(entryFiles);

const htmlPlugins = [];
const entrys = {};

entryFiles.forEach(url => {
    // 写正则 ->    /.../ 两边/，然后中间写规则，$表示结尾，[a-zA-Z]表示匹配大小写英文字母
    if (/([a-zA-Z]+-[a-zA-Z]+)\.entry\.js$/.test(url)) {
        const entryKey = RegExp.$1;
        console.log('entryKey', entryKey);
        const [pagesName, actionName] = entryKey.split('-');
        entrys[entryKey] = `./src/web/views/${pagesName}/${entryKey}.entry.js`;

        //动态匹配模板文件
        htmlPlugins.push(new HtmlWebpackPlugin({
            filename: `../views/${pagesName}/${actionName}.html`, //基于 output 的路径
            template: `./src/web/views/${pagesName}/${actionName}.html`,
            chunks: ["runtime", entryKey], //仅打包自己的js
            inject: false, //配置是否将资源文件(js、css)注入html
        }))
    }
});
console.log('entrys--->', entrys);
// console.log('htmlPlugins--->', htmlPlugins);

// 通用配置
const baseConfig = {
    mode: mode,
    entry: entrys,
    output: {
        path: join(__dirname, './dist/assets'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
        ]
    },
    plugins: [
        ...htmlPlugins,
        new MiniCssExtractPlugin(),
        new AfterHtmlPlugin(),
    ],
    resolve: {
        // 定义别名
        alias: {
            "@components": resolve("src/web/components"),
            "@assets": resolve("src/web/assets")
        }
    }
}

module.exports = merge(baseConfig, envConfig);