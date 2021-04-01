## 本项目内容
* 对专题二Node做BFF层的项目进行服务端、前端的代码划分。
* 使用Webpack编译前端代码（多页面应用MPA）；使用Gulp对node项目进行流清洗，打包服务端代码。


### 一、初始化项目 整理项目文件结构
1. 项目基于专题二作业的基础，首先先对项目进行服务端(node BFF层代码)、前端的代码划分：
2. 将 BFF 层 MVC 架构相关代码放置在 /src/server/ 下；将前端资源、组件等代码放置在 /src/web/ 下


### 二、引入Webpack对前端代码进行打包
#### 创建目录存放打包脚本，使用 scripts 包进行脚本管理
* 在项目根目录下创建 scripts 目录：server 目录下存放打包服务端开发&生产环境的脚本。client 目录下存放打包前端开发&生产环境的脚本。
    * server
        * dev. sh
        * prod. sh
    * client
        * dev. sh
        * prod. sh

    

* 安装 scripts
    > npm i -D scripts

    配置 package.json 脚本：

    ```
    // 需要注意格式 与脚本文件目录匹配

    "scripts": {
        "client:dev": "scripty",
        "client:prod": "scripty",
        "client:start": "scripty",
        "server:dev": "scripty",
        "server:prod": "scripty",
        "server:start": "scripty",
        ...
    },
    ```
    
#### 引入 webpack 构建 MPA 多页应用
> npm i -D webpack webpack-cli
        
1. 创建生产&开发环境不同配置文件；引入 webpack-merge 为合并配置用
> npm i -D webpack-merge

* 打包脚本里将打包模式参数传入:

```
// scripts/client/dev.sh

webpack --mode development
```
* 修改webpack配置文件

```
const { argv } = require('yargs');

// 取打包环境参数
const mode = argv.mode; 

// 根据打包环境获取相应配置文件
const envConfig = require(`./config/webpack.${mode}.config.js`); 

...

const baseConfig = {
    ...
    mode: mode,
    ...
}

```

2. 配置 loader
    
    - 这里不赘述，配置 babel 处理 js 文件，css-loader 处理 css 文件
    - 使用 mini-css-extract-plugin 对 css 文件单独打包


3. 匹配入口文件，配置多入口

    在页面目录下创建不同页面的入口 xx.entry.js 文件，这里自定义一种文件格式，方便在webpack文件里代码匹配所有入口文件，书写匹配入口文件代码：

```
const glob = require('glob'); //查找文件用

// 2. 遍历匹配入口文件

const entryFiles = glob.sync('./src/web/views/**/*.entry.js');
const entrys = {};

entryFiles.forEach(url => {
    // 写正则 ->    /.../ 两边/，然后中间写规则，$表示结尾
    if (/([a-zA-Z]+-[a-zA-Z]+)\.entry\.js$/.test(url)) {
        const entryKey = RegExp.$1;
        const [pagesName, actionName] = entryKey.split('-');
        // 构建入口
        entrys[entryKey] = `./src/web/views/${pagesName}/${entryKey}.entry.js`;
    }
});

...

const baseConfig = {
    ...
    entry: entrys,
    ...
}

```

4. 使用 koa-swig 整理 html，创建模板页面，思路：
    - web/views/layouts/index.html -> 模板
    - web/views/components 下写一个简单的导航页面
    - 在模板页中 include 引入导航页面
    - web/views/books 下的 html extends 继承模板开发各自页面

5. 用到 html-webpack-plugin 自动构建页面
> npm i -D html-webpack-plugin

到这里基于上面做的工作，配置 plugin，动态匹配模板，不同页面仅引入该页面资源文件，完善代码：

```
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 2. 遍历入口文件
const entryFiles = glob.sync('./src/web/views/**/*.entry.js');
const entrys = {};
const htmlPlugins = [];

entryFiles.forEach(url => {
    // 写正则 ->    /.../ 两边/，然后中间写规则，$表示结尾
    if (/([a-zA-Z]+-[a-zA-Z]+)\.entry\.js$/.test(url)) {
        const entryKey = RegExp.$1;
        console.log('entryKey', entryKey);
        const [pagesName, actionName] = entryKey.split('-');
        entrys[entryKey] = `./src/web/views/${pagesName}/${entryKey}.entry.js`;

        // 动态匹配模板文件
        htmlPlugins.push(new HtmlWebpackPlugin({
            // 基于output配置的路径
            filename: `../views/${pagesName}/${actionName}.html`, 
            template: `./src/web/views/${pagesName}/${actionName}.html`,
            chunks: ["runtime", entryKey], //仅打包该页面自己的js
        }))
    }
});

...

const baseConfig = {
    ...
    entry: entrys,
    plugins: [
        ...htmlPlugins,
    ]
}

```

6. 编写webpack plugin 修复打包后页面 js、css 文件位置错误的问题

    在完成上面工作后，打包一下会发现一个问题，打包后的 js、css 文件都不在我们期望的模板的预留位置中：js 被放在了最后面，css 被放在了最上面。所以我们需要修正一下打包的结果。列一下思路：

    * 在页面模板内期望插入文件的位置预留占位符： 
        
        ```
        <!-- injectjs --> 

        <!-- injectcss -->
        ```
    
    * 书写plugins/AfterHtmlPlugin.js
    
        ```
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        const pluginName = 'AfterHtmlPlugin';

        class AfterHtmlPlugin {
            apply(compiler) {
                // compiler 是 webpack 编译对象，全局唯一
                compiler.hooks.compilation.tap(pluginName, compilation => {
                    // compilation 是每一次构建的时候都会生成的对象 害 在没有看原理之前姑且先这么理解吧
                    console.log('The compiler is starting a new compilation...')

                    // 这个生命周期拿css、js数组
                    HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
                        pluginName,
                        (data, cb) => {
                            console.log('assets->', data.assets);
                            console.log(this);
                            // 获取资源数组存到当前插件里
                            this.jsArr = data.assets.js;
                            this.cssArr = data.assets.css;
                            cb(null, data)
                        }
                    )

                    // Static Plugin interface |compilation |HOOK NAME | register listener 
                    // 这个生命周期重新写入 js、css
                    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                        pluginName, // <-- Set a meaningful name here for stacktraces
                        (data, cb) => {
                            // Manipulate the content
                            const scriptString = createHtml('js', this.jsArr);
                            const linkString = createHtml('css', this.cssArr);
                            data.html = data.html.replace('<!-- injectjs -->', scriptString);
                            data.html = data.html.replace('<!-- injectcss -->', linkString);

                            // Tell webpack to move on
                            cb(null, data)
                        }
                    )
                })
            }
        }

        function createHtml(type, array) {
            let result = '';
            if (type === 'js') {
                array.forEach(url => {
                    result += `<script src="${url}" type="text/javascript"></script>`
                });
            } else if (type === 'css') {
                array.forEach(url => {
                    result += `<link href="${url}" rel="stylesheet" type="text/css">`
                });
            }
            return result;
        }

        module.exports = AfterHtmlPlugin;

        ```

    * 修改 webpack htmlPlugin 的配置，不由插件插入资源文件了
        
        ```
        ...

        htmlPlugins.push(new HtmlWebpackPlugin({
            ...
            inject: false, // 配置是否将资源文件(js、css)注入html
        }))

        ...
        ```

7. 将前端组件的代码拷贝至打包后的指定路径下
> npm i -D copy-webpack-plugin

对于生产/开发环境拷贝后进行不同的配置（文件压缩），这里不贴代码了，看 /config/webpack.xxx.config.js 吧

###### 打包，至此，前端打包后的项目结构就跟我们代码本身的结构一样了。前端打包告一段落，一些更细的东西没有在这里列了，看代码吧。


### 三、使用 gulp 对 node 项目进行流清洗，打包服务端代码
> npm i -D gulp

#### 书写打包命令
```
NODE_ENV=development gulp

NODE_ENV=production gulp
```

#### 创建 gulpfile.js 书写打包代码
1. 根据执行脚本时传递的打包环境参数区分打包流程
```
const path = require('path');
const gulp = require('gulp');

// 开发环境打包
function buildDev() {
    ...
}

// 线上环境打包
function buildProd() {
    ...
}

// 区分环境进行打包
let build = null;
if (process.env.NODE_ENV === 'development') {
    build = gulp.series(buildDev);
}
if (process.env.NODE_ENV === 'production') {
    build = gulp.series(buildProd);
}

gulp.task('default', build); // 注册任务

```

2. 使用 gulp-babel 对 js 文件进行清洗；使用 gulp-watch 对开发环境打包过程进行热更新监听
> npm i -D gulp-watch gulp-babel @babel/plugin-transform-modules-commonjs

```
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const entry = './src/server/**/*.js';

...

// 开发环境打包
function buildDev() {
    return watch(entry, { ignoreInitial: false })
        .pipe(babel({
            babelrc: false, //不使用.babelrc文件配置，这个文件是给webpack打包前端代码用的
            plugins: ["@babel/plugin-transform-modules-commonjs"] //使用这个插件处理
        }))
        .pipe(gulp.dest('dist/server')) //dest指定输出目录
}

...
```

3. 对于生产环境对垃圾代码进行清洗

这里是在 /config/config.js 里写一些垃圾代码为例进行讲解

* 使用 gulp-rollup 进行 treeshaking 工作
    > npm i -D gulp-rollup

    ```
    const rollup = require('gulp-rollup');

    ...

    // 清洗 config 目录（这里只是因为在config下的文件里写了废代码所以清洗这个，就是举个例子）
    function cleanConfig() {
        return gulp.src(entry)
            .pipe(
                rollup({
                    input: path.join(__dirname, './src/server/config/config.js'), //要清洗的文件
                    output: { format: "cjs" },
                })
            )
            .pipe(gulp.dest('dist/server'));
    }

    ...

    if (process.env.NODE_ENV === 'production') {
        build = gulp.series(buildProd, cleanConfig);
    }
    ...
    ```


* 使用 @rollup/plugin-replace 优化

    > npm i -D @rollup/plugin-replace

    在 config.js 里有一段通过 if 判断匹配不同配置对象的代码，对这段代码进行优化：安装插件，对字符串进行替换达到 treeshaking 的效果。完善代码如下：

    ```
    const replace = require('@rollup/plugin-replace');

    ...

    // 清洗 config 目录（这里只是因为在config下的文件里写了废代码所以清洗这个，就是举个例子）
    function cleanConfig() {
        return gulp.src(entry)
            .pipe(
                rollup({
                    input: path.join(__dirname, './src/server/config/config.js'),
                    output: { format: "cjs" },
                    plugins: [
                        replace({
                            //将key替换为value：在打包config文件时就只会匹配上线环境的配置对象了
                            'process.env.NODE_ENV': JSON.stringify('production'),
                        })
                    ]
                })
            )
            .pipe(gulp.dest('dist/server'));
    }

    ```

###### 至此对服务端代码打包的工作也基本完成


### 四、打包命令优化

1. preCMD
> 加上pre前缀后在执行CMD前会先执行这个preCMD命令里的内容
2. 安装插件并行/串行执行多条命令
> npm i -D npm-run-all

优化后的脚本：
```
"scripts": {
    "prebuild:dev": "rm -rf ./dist",
    "build:dev": "npm-run-all --parallel client:dev server:dev",
    "start": "NODE_ENV=development nodemon ./src/server --exec 'babel-node ./src/server/app.js'",
    "start:dist": "NODE_ENV=development nodemon ./dist/server/app.js"
},
```