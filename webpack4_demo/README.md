* 要非常注意demo webpack版本，因为现在已经更新到webpack5了 ...

### 一、初始化项目
```
npm init -y
npm install webpack webpack-cli -D
```
打包后把编译后的文件扔进html页面然后再浏览器打开验证打包后的文件是否可以正常工作


### 二、loader
1. 处理一些文件
处理图片 font 等文件
npm install file-loader --save-dev

图片
url-loader limit

2. less-loader css-loader style-loader
   postcss-loader

### 三、plugins
1. 打包后自动创建 html 文件，把所有打包后的资源文件引入进去，这个插件有很多配置项，包括创建的文件的模板巴拉巴拉：
https://www.npmjs.com/package/html-webpack-plugin

2. 自动清除 dist 目录插件：
https://www.npmjs.com/package/clean-webpack-plugin


### 四、多入口配置

### 五、资源文件 CDN 配置：publicPath


### 六、定位错误：打包压缩后的代码无法阅读，难以定位错误
```
devtool: "sourceMap"
devtool: "cheap-module-eval-sourvce-map"
devtool: "cheap-module-source-map"
```

### 七、热更新
##### 1. 打包热更新：文件更新后热更新进行打包，这个不会联动页面更新

在打包命令中添加--watch参数
> webpack --watch

##### 2. 热更新页面刷新：启动了一个监听服务器

安装依赖包：
> npm install wepack-dev-server -D

增加启动脚本：
> "start:dev": "webpack-dev-server"

运行脚本启动服务：
> npm run start:dev

webpack的配置文件中可以修改配置，在配置项 devServer 中进行配置

- 这里踩了很多坑，一开始页面始终无法正常加载，会出来 ~/ 这种页面，然后复盘发现了几个一改就无法加载的配置项：

    - 首先是一个plugin的配置：html-webpack-plugin，这个plugin生成的文件名称必须是 index.html 才可以，改成其他名称不行

    - output->publicPath的配置，必须先配置成/，不然不行

- 不过dev-server有个问题是，无论是修改哪个文件，都会整个刷新页面；我们希望的是修改了哪部分资源就更新哪里

##### 3. HMR hot module replacement

开启步骤:

1. 使用webpack-dev-server作为服务器启动

2. devserver 配置中 hot:true

3. plugins 配置 hotModuleReplacementPlugin：webpack自带的

4. 在js模块中增加 module.hot.acceput增加 hmr 代码

测试：只修改list文件，发现只有输出list被更新的部分，main.js中的alert不会随着一起被更新（不会弹出）


### 八、babel js解释器 将 ES5+ 转换为 ES5
1. 安装 babel 核心的依赖包
> npm install -D @babel/core @babel/preset-env babel-loader

注意：babel对标准引入的语法比如箭头函数、let、const等可以进行转换；但是对于标准引入的原生对象的新的原型链上的方法、全局变量等无法进行转换
比如新增了 Array.prototype.map()，这个map方法打包后还是map，没有转换过来。

所以基于这个我们需要新的工具帮我们处理:

2. @bable/polyfill
> npm install -D @babel/polyfill

然后 import 到代码中

> import "@babel/polyfill";

打包，发现打包后的main.js没有几行代码但是却有400k+，这个是因为我们直接把整个 babel/polyfill 都引入了，我们希望它按需引入，需要进行配置

> ["@babel/preset-env", { useBuiltIn: "usage" }]

再次打包, 发现小很多了 只有40k+

警示信息 安装core-js@3 默认使用 core-js@2
> npm install --save core-js@3

3. @babel/plugin-transform-runtime 以闭包形式注入

polyfill 以全局变量形式注入，可能会造成全局环境的污染，如果在开发类库、UI组件时不好
> npm install -D @babel/plugin-transform-runtime

相应的也要安一个 corejs3
> npm install -D @babel/runtime-corejs3

4. 对babel的配置项优化：可以一起放在 .babelrc 文件下


### 九、treeshaking 摇树优化
1. 需要满足 ES6 模块化语法要求：比如 lodash-es 可以被优化，但是 lodash(闭包形式) 不行
2. webpack4 将 mode="production" 即可自动进行摇树优化
3. webpack3 需要使用 ugligyjsWebpackPlugin 


### 十、优化 之 打包环境不同配置文件的区分
1. 分析不同环境需要用的东西，为不同环境配置不同的配置文件，具体看配置文件吧，都在 config 目录下，需要注意一些路径的变更
webpack.prod.js : 生产配置
webpack.dev.js : 开发环境配置
webpack.base.js : 共用配置

2. 使用 webpack-merge 进行配置文件的合并
> npm install -D webpack-merge

使用：
```
const { merge } = require('webpack-merge');
const baseConfig = require('./config/webpack.base.js');
const devConfig = { ... }
module.exports = merge( baseConfig, debConfig );
```
3. 修改 package.json 启动脚本，指定配置文件路径
```
"build": "webpack --config ./config/webpack.prod.js",
"start:dev": "webpack-dev-server --config ./config/webpack.dev.js",
"start:prod": "webpack-dev-server --config ./config/webpack.prod.js"
```


### 十一、优化 之 第三方库的单独打包
以jquery为例，先安装一下
> npm install -D jquery

1. 入口配置
修改 webpack.config.js 并配合 webpack 自带的 ProvidePlugin 配置 plugins
```
...
    entry: {
        ...
        jquery: 'jquery'
    }
    plugins:[
        new webpack.ProvidePlugin({
            // identifier: path.resolve(path.join(__dirname, 'src/module1'))
            $: "jquery",
            jQuery: "jquery"
        })
    ]
...
```
配置好之后无需在文件中再次引入jquery，就可以用通过 $ 或者 jQuery 进行使用，且打包后的文件中会出现一个单独的 jquery 文件

2. 动态加载
配合 @babel/plugin-syntax-dynamic-import 这个 plugin 实现动态加载。使用时在代码中动态引入

- 首先先安装plugin
> npm install -D @babel/plugin-syntax-dynamic-import

- 因为是 babel 的 plugin，所以需要对 .babelrc 进行修改
```
{
    "plugins": [
        ...
        "@babel/plugin-syntax-dynamic-import"
    ]
}
```

- 在要使用的地方如下，即可
```
import(/*webpackChunkName: 'jquery'*/ 'jquery').then(({ default: $ }) => {
    console.log('第三方库打包优化方法三 -> 动态加载');
});
```

3. 抽取公共代码(推荐)
webpack4 提供了 SplitChunksPlugin 插件（改插件取代了之前版本的 commonChunksPlugin，因为速度更快）。这个插件会对项目中的公共代码进行抽取，并进行单独的打包。附上官网链接：https://webpack.docschina.org/configuration/optimization/

比如我们在不同文件内都引入了 jquery，然后进行配置：
```
optimization: {
        splitChunks: {
            chunks: "all", //这表明将选择哪些 chunk 进行优化, 有效值为 all，async 和 initial
        }
    },
```

打包发现公共的代码被抽取出来单独打包成文件了


### 十二、优化 之 CSS 代码分割
这里笔记中记录比较详细，也贴了每一步的效果图，请自行切屏
1. css 文件抽取单独打包：借助 mini-css-extract-plugin
2. css 打包后文件压缩：借助 optimize-css-assets-webpack-plugin
3. 解决css打包压缩后js文件压缩被影响的问题，借助插件：terser-webpack-plugin


### 十三、代码包分析工具
使用  webpack-bundle-analyzer
>  npm install -D  webpack-bundle-analyzer

在配置文件中引入，进行 plugins 配置
```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    ...
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}
```


### 十四、环境变量的获取
推荐使用插件 yargs，安装：
> npm install yargs

修改 package.json 启动脚本，传入自定义的参数 NODE_ENV：
> "build:dev": "webpack --config ./config/dev.config.js --NODE_ENV development"

使用：先引入插件，输出我们定义好的参数
```
const yargsArgv = require('yargs').argv;

// 拿到定义好的 NODE_ENV 参数，进行模式的判断。可以拿着这个参数去进行配置的区分。
const modeFlag = yargsArgv.NODE_ENV === 'development'? true:false; 
```