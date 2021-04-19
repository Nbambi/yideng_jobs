#### 项目内容
1. IOC思想应用：完成一个简单的获取数据接口输出
2. 技术栈：NodeJS、ts


#### Code
1. 初始化项目，用 Koa 搭建项目，端口8081
    - 使用 ts 书写代码，安装 @types/xxx（@types 的东西是由微软维护的）

2. 创建 ts 配置文件，针对上面 Koa报错对配置文件进行修改

3. IOC 第三方包 awilix 的引入

4. 搭建项目目录结构框架
    - interface
        * IData.ts 一个数据类型
        * IApi.ts Api Interface，返回 Promise<IData>
    - service
        * ApiService 业务服务层，实现 IApi.ts 接口，实现接口内函数
    - routes
        * controller 层，处理路由，调用 service 层进行业务处理

5. 别名处理，针对 ../../../../xxx 这种路由，指定一个别名及路径，在ts配置文件中进行相应的路由配置

6. app.js use 容器，容器中扫描 services 并注入

7. 安装 ts-node-dev 用于启动服务； 启动服务 访问 api/list/ 发现已经可以返回我们造的数据了

8. 接下来搞页面，引入 koa-swig、co、@types/node
发现没有 @types/koa-swig，得自己声明 render
创建 typings 文件夹 -> koa-swig.d.ts 声明一个模块，声明 render 函数，接收两种类型参数：string 和 默认接收的对象（把api需要的我们自己定义在一起以支持ts）

9. 搞一个 IndexController，搞一个首页

