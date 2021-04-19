import Koa from 'koa';
import { createContainer, Lifetime } from 'awilix';
import { scopePerRequest, loadControllers } from 'awilix-koa';
import path from 'path';
import render from 'koa-swig';
import co from 'co';

import { addAliases } from 'module-alias'; //处理../../../的路径问题
// 添加别名，要在tsconfig配置
addAliases({
    "@root": __dirname,
    "@interfaces": `${__dirname}/interfaces`,
});

const app = new Koa();
app.context.render = co.wrap(render({
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: 'memory', // disable, set to false
    ext: 'html',
    writeBody: false
}));


// 创建基础容器 负责装载服务 为依赖注入做准备
const container = createContainer();
// 匹配 services 下的所有类，将其注入容器
container.loadModules([`${__dirname}/services/*.ts`], {
    formatName: 'camelCase', //驼峰命名
    resolverOptions: {
        lifetime: Lifetime.SCOPED, //每次创建的时候是什么方式: 重新new一个还是单例等，这里是重新创建一个新的
    }
})
// 把 container 注入项目中
app.use(scopePerRequest(container));
// 注册 controllers
app.use(loadControllers(`${__dirname}/routers/*.ts`));



app.listen(8081, () => {
    console.log('IOC node');
});
