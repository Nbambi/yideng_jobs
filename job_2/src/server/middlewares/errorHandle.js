// 错误处理中间件
const errorHandle = {
    // 提供 init 初始化方法，将中间件挂载到 app 上
    init(app, logger) {
        app.use(async (ctx, next) => {
            try {
                await next();
            } catch (error) {
                // 报错
                logger.error(error);
                ctx.body = "error";
            }
            // 未报错
            switch (ctx.status) {
                case 404:
                    ctx.body = "404， 页面未找到";
                    break;
                case 500:
                    ctx.body = "server error";
                    break;
            }
        });
    }
}

export default errorHandle;