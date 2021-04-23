## 一、本项目内容
* 基于专题三作业代码完成专题四作业要求；专题五CSS实践
* 内容：利用 X-TAG 完成刷页SSR、切页SPA（VueSSR 原理简易版）



### 二、前置知识 - NodeJS项目优化思路
- mpa & spa 项目优缺点
    * mpa 
        * 优点：页面直出 首页加载快 利于seo；缺点 模板维护成本高 路由切换资源会重复加载
        * 优化点：吐页面的时候可以使用 bigpipe 进行优化，一段一段地往出吐内容

    * spa 
        * 缺点：首屏加载时间长 
        * 优点：切页的时候再加载的资源少 用户体验好

    * 理想的，同构：
        * 刷页/落地页(路径直接访问) -> 页面直出；
        * 站内切页 -> spa，加载最小资源

- 专题三作业的代码最终是个 MPA 项目，接下来就进行编码



### 三、Code

1. 整理项目打包的目标路径
    
    把所有打包后的东西都放在 dist 下，不区分 web / server 文件夹了。这里就是一堆修改路径的工作，不赘述。

2. 使用 pjax 实现页面页面局部刷新

    在模板页面文件 src/web/views/layouts/index.html 里引入第三方包（在 bootCDN 里找）：

    * jquery
    * pjax：切页不整页刷新：pjax 代理导航目录的 a 标签，指定容器，实现局部刷新页面内容 不引起整个页面的重新加载。（PS：pjax 可以写进简历里 规则引擎使用了）

    
```
<!-- 模板文件 -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>{% block title %} {% endblock %}</title>
        {% block head %} {% endblock %}
    </head>
    <body>
        {% include '../../components/banner/banner.html' %}
        
        <!-- 进行局部刷新的容器 id="app" -->
        <div id="app">
            {% block content %}{% endblock %}
        </div>
        
        <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js"></script>
        <script src="https://cdn.bootcdn.net/ajax/libs/jquery.pjax/2.0.1/jquery.pjax.js"></script>
        <script>
            $(document).pjax('a', '#app'); //代理a标签(a标签来自banner组件页面)
        </script>
        {% block scripts %}{% endblock %}
    </body>
</html>
```

3. 项目打包运行后会发现，当我们点击导航 a 标签进行切页时，Network Request Headers 里多了几个请求头，这表明我们配置的 pjax 生效了

```
X-PJAX: true
X-PJAX-Container: #app
```

* 这里我们就可以利用这个请求头去判断页面类型了，思路如下：
    * 如果是在站内切（局部刷新）那肯定会带这个请求头：SPA 加载对应页面的资源
    * 如果没有就是落地页：SSR + bigpipe 直出


4. 改造 Controller 实现落地页 站内切页的不同处理
    * 这里只对 books/create 这个 action 进行改造了
    * 思路：
        * 根据请求头判断 落地页/站内切页
        * 落地页将 html 页面 bigpipe 吐出去
            * 注意修改 app.js 模板引擎的配置
        * 站内切页获取静态资源（DOM .pajaxConent & JS .lazyload-js），这里自定义了两个类去模拟标识该页面需要加载的资源；静态资源 + html 吐出去
            * 需要在 html-webpack-plugin 插件里生成 js 标签那里手动加一下这个类
        * 注意 js 在绑定事件的时候要事件代理到上层

```
// BooksController.js

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
```     


```
// AfterHtmlPlugin.js

function createHtml(type, array) {
    let result = '';
    if (type === 'js') {
        array.forEach(url => {
            // result += `<script src="${url}" type="text/javascript"></script>`
            // .lazyload-js 为了 SPA 渲染做准备
            result += `<script class="lazyload-js" src="${url}" type="text/javascript"></script>`
        });
    } else if (type === 'css') {
        array.forEach(url => {
            result += `<link href="${url}" rel="stylesheet" type="text/css">`
        });
    }
    return result;
}
```


```
// app.js

app.context.render = co.wrap(swig({
    ...
    writeBody: false, //bigpipe 需要这个配置项配合，不然无法生效
}));
```

5. 优化页面里的 include ../../../../ 这种东西
    * 在 webpack plugin 里做优化，改一下 views 下的 html（如果要改 entry.js 里的路径，得在 webpack 配置文件里改，别搞错）

```
// AfterHtmlPlugin.js
...
    // 这个生命周期重新写入 js、css
    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        pluginName, // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
            // Manipulate the content
            const scriptString = createHtml('js', this.jsArr);
            const linkString = createHtml('css', this.cssArr);
            data.html = data.html.replace('<!-- injectjs -->', scriptString);
            data.html = data.html.replace('<!-- injectcss -->', linkString);
            data.html = data.html.replace('@components', '../../components'); //主要是这里

            // Tell webpack to move on
            cb(null, data)
        }
    )
...

```


```
// create.html

{% extends '../layouts/index.html' %}

{% block title %}图书创建页面{% endblock %}

{% block head %}
<!-- injectcss -->
{% endblock %}

{% block content %}
<div>
    <h1>创建图书</h1>
    <!-- {% include '../../components/add/add.html' %} -->
    <!-- 主要是看这里，替换一下就可以了 -->
    {% include '@components/add/add.html' %}
</div>
{% endblock %}

{% block scripts %}
<!-- injectjs -->
{% endblock %}

```


### 四、专题五实践
1. 把 postcss 加进项目里

> npm install -D postcss-loader

> npm install -D postcss-preset-env

创建 postcss.config.js 配置文件并配置；修改 webpack 配置

```
// webpack.config.js
...
module: {
    rules: [
        {
            test: /\.js$/,
            use: ['babel-loader']
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                'postcss-loader'
            ]
        },
    ]
},
...
```

2. CopyPlugin 修正：因为js、css文件会被单独打包到dist，所以其实主要 copy html 就可以；另外修正一下目录结构，直接至 components 下即可。