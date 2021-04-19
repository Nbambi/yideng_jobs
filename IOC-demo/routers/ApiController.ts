/**
 * controller 层，接收路由进行不同业务处理
 *      调用 service 层
 */


import { IApi } from '@interfaces/IApi';
import { GET, route } from 'awilix-koa';
import Router from 'koa-router';

@route("/api")
class ApiController {
    private apiService: IApi;
    constructor({ apiService }: { apiService: IApi }) {
        this.apiService = apiService;
    }

    @route("/list")
    @GET()
    async actionList(
        ctx: Router.IRouterContext,
        next: () => Promise<unknown>
    ): Promise<any> {
        const data = await this.apiService.getInfo();
        ctx.body = { data };
    }
}

export default ApiController;