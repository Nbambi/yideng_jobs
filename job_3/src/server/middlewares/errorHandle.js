// 错误处理中间件
const errorHandle = {
    // 提供 init 初始化方法，将中间件注册到 app 上
    init(app, logger) {
        app.use(async (ctx, next) => {
            // 对全局的报错进行兜底
            try {
                await next();
            } catch (error) {
                logger.error(error); //错误日志打印
                ctx.body = "error";
            }

            // 根据请求状态进行判断，对不同状态进行不同的错误提示
            switch (ctx.status) {
                case 404:
                    ctx.body = "404， 页面未找到!";
                    break;
                case 500:
                    ctx.body = "server error!";
                    break;
            }
        });
    }
}

export default errorHandle;