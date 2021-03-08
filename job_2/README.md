# 专题二实战：实现BFF层代码
BFF层代码：job_2（结合koa录播看）  
server端代码： /basic（server端只有查看全部的接口可用）

## 一、编码思路及内容
### 搭建项目框架
- koa 框架引入  
- ES6 语法支持  
- 热更新支持  
- 静态资源管理 koa-static

### 中间件编写
- koa-router 路由中间件引入  
- 错误中间件编写及抽取  
- 日志记录功能  
- 错误处理＋日志  
- 抽取配置文件  

### 搭建 MVC 架构
- 书写 controller：匹配及处理路由，返回页面/数据
- 书写 model 层：数据调用层，利用 node-fetch 获取后端接口返回的数据  
- 优化：SafeRequest 抽象，规范所有的 fetch 格式  
- 书写 View：使用 koa-swig 模板  

### 函数式编程 + 节流
- 模仿 underscore、lodash 编写函数式编程工具类 utils/util.js
- 在 util.js 中写一个节流函数

## 二、知识点罗列
### ES6 模块化支持
commonJs规范引入模块写法：require  
ES6语法为import，为了支持ES6的import写法，需要引入babel进行编译

- 安装 @babel/node：https://babeljs.io/docs/en/babel-node
> npm install --save-dev @babel/core @babel/node

- 安装 @babel/preset-env：https://babeljs.io/docs/en/babel-preset-env#docsNav
> npm install --save-dev @babel/preset-env

- 创建配置文件 .babelrc
启动脚本变更
> babel-node ./app.js

### 开发环境热更新
- 安装 nodemon：https://www.npmjs.com/package/nodemon
> npm install --save-dev nodemon

- 启动脚本变更：用法参照官网
> "dev": "nodemon --watch ./src/server --exec 'babel-node ./src/server/app.js'"

### 日志记录
- 安装log4js node：https://www.npmjs.com/package/log4js  
- 引入及使用：参照官网，修改配置及输出错误文件的路径（借助 path 模块的 join 方法）
 
### node-fetch   
- 安装及使用：https://www.npmjs.com/package/node-fetch
> npm install node-fetch --save

### 模板引擎：使用了koa-swig
- 需要注意的是需要同时安装 koa-swig 和 co ，参考官网，不同的 node 版本写法不一样
> npm install koa-swig
> npm install co

- 使用：在 app.context 上使用注册一个 render 方法（调用 swig ）
```
import swig from 'koa-swig'; // 模板引擎
import co from 'co'; // koa-swig 需要引入

// 在 app.context 上使用注册一个 render 方法（调用 swig ）; koa本身是没有这个方法的 ; 这样就可以通过 ctx.render 进行调用了
// 为什么可以通过这样操作呢，跟 Koa 的底层原理有关，参见 Koa 源码 application createContext()方法
app.context.render = co.wrap(swig({
    root: config.viewDir,
    autoescape: true,
    cache: false,
    ext: 'html'
}));
```


### 节流函数（考点）
- 节流：
    - 每隔一段时间只会执行一次，即使是多次触发
    - 第一次触发会立即执行
    - 如果在间隔时间内触发 会在间隔末尾再执行一次



