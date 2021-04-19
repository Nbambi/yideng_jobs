const HtmlWebpackPlugin = require('html-webpack-plugin');
const pluginName = 'AfterHtmlPlugin';

class AfterHtmlPlugin {
    apply(compiler) {
        // compiler 是 webpack 编译对象，全局唯一
        compiler.hooks.compilation.tap(pluginName, compilation => {
            // compilation 是每一次构建的时候都会生成的对象 害 在没有看原理之前姑且先这么理解吧
            console.log('The compiler is starting a new compilation...')

            // 这个生命周期拿css、js数组
            HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
                pluginName,
                (data, cb) => {
                    console.log('assets->', data.assets);
                    console.log(this);
                    // 获取资源数组存到当前插件里
                    this.jsArr = data.assets.js;
                    this.cssArr = data.assets.css;
                    cb(null, data)
                }
            )

            // Static Plugin interface |compilation |HOOK NAME | register listener 
            // 这个生命周期重新写入 js、css
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                pluginName, // <-- Set a meaningful name here for stacktraces
                (data, cb) => {
                    // Manipulate the content
                    const scriptString = createHtml('js', this.jsArr);
                    const linkString = createHtml('css', this.cssArr);
                    data.html = data.html.replace('<!-- injectjs -->', scriptString);
                    data.html = data.html.replace('<!-- injectcss -->', linkString);
                    data.html = data.html.replace('@components', '../../components');

                    // Tell webpack to move on
                    cb(null, data)
                }
            )
        })
    }
}

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

module.exports = AfterHtmlPlugin;