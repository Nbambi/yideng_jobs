class IndexController {
    async actionIndex(ctx, next) {
        ctx.body = "index";
    }
}

export default IndexController;