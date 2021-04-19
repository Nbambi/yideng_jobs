class IndexController {
    async actionIndex(ctx, next) {
        // ctx.body = "index";
        ctx.body = await ctx.render(('layouts/index'));
    }
}

export default IndexController;