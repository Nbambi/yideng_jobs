import BooksModel from '../models/BooksModel';
import { Readable } from 'stream';
import { load } from 'cheerio'; //一个跟jquery类似的东西
import { createGzip } from 'zlib';

class BooksController {
    // 图书列表
    async actionList(ctx, next) {
        const booksModel = new BooksModel();
        const data = await booksModel.getBooksList();
        // 这里的 render 方法是 app.js 里 swig 注册进来的
        ctx.body = await ctx.render(('books/list'), { data });
    }

    // 新建书籍
    async actionCreate(ctx, next) {
        // ctx.body = await ctx.render(('books/create'));

        // 改造：落地页 bigpipe 直出；站内切页加载对应静态资源
        const html = await ctx.render(('books/create'));
        /**
         * 如果带了这个请求头，说明是站内切页（a标签被代理了）
         * 则仅加载需要更新的资源
         */
        if (ctx.request.header["x-pjax"]) {
            console.log('站内切');
            const $ = load(html);
            ctx.status = 200; //标识一下 200，不然返回的状态码是有问题的
            ctx.type = 'html';

            // 加载 DOM：自定义一个 pajaxContent 类，表示是随着页面会被局部刷新的内容
            $('.pajaxContent').each(function () {
                console.log('chunk:', $(this).html());
                ctx.res.write($(this).html());
            });

            // 加载 JS：自定义 lazyload-js 类(html-webpack-plugin 生成页面插件里手动加的)，取页面的静态资源文件
            $('.lazyload-js').each(function () {
                ctx.res.write(
                    `<script class="lazyload-js" src="${$(this).attr('src')}" type="text/javascript"></script>`
                );
            });

            ctx.res.end();
        } else {
            /**
             * 如果没有 则为落地页，首次访问，或者直接输入网址进入
             * bigpipe 输出页面的内容
             */
            console.log('落地页');
            function createSSRStreamPromise() {
                return new Promise((resolve, reject) => {
                    // bigpipe
                    // response 里新增 chunked
                    const htmlStream = new Readable();
                    htmlStream.push(html);
                    htmlStream.push(null);
                    ctx.status = 200;
                    ctx.type = 'html';

                    // 服务器端设置 gzip，response 里新增 gzip
                    ctx.res.setHeader("content-encoding", "gzip"); //前端开启gzip
                    const gz = createGzip();

                    htmlStream
                        .on('error', (err) => {
                            reject(err);
                        })
                        .pipe(gz)
                        .pipe(ctx.res);
                });
            }
            await createSSRStreamPromise();
        }
    }
}

export default BooksController;