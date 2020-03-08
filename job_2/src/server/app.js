// const koa = require('koa'); // commonJs规范
import Koa from 'koa'; // ES6语法, 默认情况下不支持, 需要安装 babel 进行编译
import Router from 'koa-router';
import assets from 'koa-static';
import log4js from 'log4js';
import swig from 'koa-swig'; // 模板引擎
import co from 'co'; // koa-swig 需要引入

import errorHandle from './middlewares/errorHandle';  // 错误中间件
import config from './config/config'; // 配置文件
import routerController from './controllers/router';

const app = new Koa();
const router = new Router();

// koa-swig 注册一个 render 方法到 app ; koa本身是没有这个方法的
app.context.render = co.wrap(swig({
    root: config.viewDir,
    autoescape: true,
    cache: false,
    ext: 'html'
}));

// 路由 Controller
routerController(router);

// 日志管理配置初始化
log4js.configure({
    appenders: { global: { type: 'file', filename: config.logDir + '/error.log' } },
    categories: { default: { appenders: ['global'], level: 'error' } }
});
const logger = log4js.getLogger('global');

// 初始化错误处理中间件
errorHandle.init(app, logger);

// 静态资源管理
app.use(assets( config.assetsDir ));

// 使用路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, () => {
    console.log('server is running, port 3000');
});

