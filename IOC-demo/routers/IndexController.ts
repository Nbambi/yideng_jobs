/**
 * controller 层，接收路由进行不同业务处理
 *      调用 service 层
 */

import { Context } from '@interfaces/IKoa';
import { GET, route } from 'awilix-koa';

@route("/")
class IndexController {
    @route("/")
    @GET()
    async actionList(
        ctx: Context,
        next: () => Promise<unknown>
    ): Promise<any> {
        ctx.body = await ctx.render('index');
    }
}

export default IndexController;