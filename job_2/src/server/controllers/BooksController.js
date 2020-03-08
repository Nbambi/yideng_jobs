import BooksModel from '../models/BooksModel';
class BooksController {
    async actionList(ctx, next) {
        const booksModel = new BooksModel();
        const data = await booksModel.getBooksList();
        // 这里的 render 方法是 app.js 里 swig 注册进来的
        ctx.body = await ctx.render(('books/list'), {
            data
        });
    }
}

export default BooksController;