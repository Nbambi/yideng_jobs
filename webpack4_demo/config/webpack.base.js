// 共用配置

const path = require('path'); //路径处理
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Webpack = require('webpack');
const argv = require('yargs').argv;
console.log('NODE_ENV:', argv.NODE_ENV);

// webpack基于Node开发，遵循CommonJS规范
module.exports = {
    /**
     * 开启调试选项，定位源码中错误位置，配合mode="development"更适合开发调试，因为代码不被压缩
     *   1. 开发模式下推荐 cheap-module-eval-sourvce-map
     *   2. 生产环境下推荐 cheap-module-source-map（源码不会被暴露出去,展示在source中的代码是被压缩后的代码)
     */

    // 入口配置
    // entry: "./src/index.js",
    entry: {
        // 可以指定多个入口文件
        main: path.join(__dirname, '../src/main.js'),
        index: path.join(__dirname, '../src/index.js'),
        // jquery: "jquery" // 优化第三方库打包方法1
    },

    optimization: {
        splitChunks: {
            chunks: "all", //这表明将选择哪些 chunk 进行优化, 有效值为 all，async 和 initial
        }
    },

    // 出口配置
    output: {
        // filename: "main.js",
        filename: "[name].[hash:5].js", //配合多入口文件进行输出文件名称的配置,可以使用占位符[name]...
        path: path.resolve(__dirname, "../dist"), //打包后的文件输出位置
        /**
         * 静态资源文件 CDN 配置， 减少加载时间，提高用户体验
         * 配置这个之后，会在打包后生成的 html script 等路径处自动增加上配置的 CDN 的地址
         */
        // publicPath: "https://nnn.com" //这个东西相当容易出错，所有还是先给它搞掉
        publicPath: "/"
    },

    module: {
        rules: [
            // {
            //     test: /\.(jpg|png|gif)$/i, //指定检测的文件
            //     use: {
            //         loader: "file-loader", //进行文件的加载，文件打包后的文件名 路径等
            //         options: {
            //             name: "[name].[hash:5].[ext]", //占位符，分别：文件名称.hash值取5位.文件后缀名
            //             outputPath: "imgs", //基于output配置的路径
            //         }
            //     }
            // },
            {
                test: /\.(png|jpg|gif)$/i,
                use: {
                    loader: "url-loader",
                    options: {
                        name: "[name].[hash:5].[ext]", //占位符，分别：文件名称.hash值取5位.文件后缀名
                        outputPath: "imgs", //基于output配置的路径
                        /**
                         * 小于这个数值的会被打包成base64（直接被打到引入它的文件里，而不会出现在我们指定的打包位置）；如果大于这个值则不会被打成base64
                         * 配置这个比较适用于小的icon，减少请求数，大图片不建议；这个配置项也可以设置为false
                         */
                        limit: 2048
                    }
                }
            },
            {
                test: /\.ttf$/i, //字体文件
                use: {
                    loader: "file-loader"
                }
            },
            {
                test: /\.less$/i,
                /**
                 * loader 有执行顺序,如下两种写法执行顺序：
                 */
                // use: ["style-loader", "css-loader", "less-loader"],
                use: [
                    // 顺序从下到上
                    {
                        // 通过style标签将css注入到html页面
                        loader: "style-loader", //create style nodes from JS strings,不配置这个无法在html中生效
                    },
                    {
                        loader: "css-loader", //translates CSS into CommmonJS
                    },
                    {
                        loader: "postcss-loader", //FIXME 其实不懂这是啥
                        options: {
                            postcssOptions: {
                                /**
                                 * 两种写法:
                                 *  1. 一种是直接把配置项写在这个下面，如下
                                 *  2. 第二种：去看这个 loader 的 npm 文档，说可以将配置单独写成一个文件，默认会找命名为 postcss.config.js 的文件，不需要引入什么的
                                 *      当然名称也是可以自定义的，如果自定义则需要在下面的配置里指定路径，这里就去看官方提供的文档就可以
                                 * 
                                 *  我这里最后使用了第二种方式 把配置写在外面了
                                 */
                                //     plugins: [
                                //         require("autoprefixer") // 处理css前缀兼容性问题
                                //     ]
                            },
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
            {
                test: /\.js$/i,
                exclude: '/node_modules',
                loader: "babel-loader",
                // 统一配置在 .babelrc 下
                options: {}
            },
        ]
    },

    plugins: [
        // 清除 dist 目录
        new CleanWebpackPlugin(),
        // 自动生成 html 页面插件
        new HtmlWebpackPlugin({
            //指定生成的文件的名称
            // filename: "bundle.html", //测试了一下，如果要用dev-server热更新刷新页面，这个文件必须是index.html，如果改成其他的名称页面就加载失败
            filename: "index.html",

            //template:指定生成文件的文件模板，可以在里面添加 html 元素，生成的打包后文件会按照这个模板生成
            template: path.join(__dirname, '../src/pages/template.html'),
        }),
        // 优化第三方库打包方法1
        // new Webpack.ProvidePlugin({
        //     $: 'jquery'
        // })
    ]
}