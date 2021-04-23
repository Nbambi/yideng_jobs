const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const { minify } = require("html-minifier"); //压缩处理 html 的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    output: {
        filename: "[name].js"
    },
    optimization: {
        minimizer: [new OptimizeCssAssetsPlugin({})]
    },
    plugins: [
        // 拷贝组件到打包后的项目中 dist，打包后文件在线上环境要压缩
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../src/web/views/layouts/index.prod.html'),
                    to: "../views/layouts/index.html", //to的路径基于output.path
                    transform(content) {
                        return minify(
                            content.toString(),
                            { collapseWhitespace: true } //去除空格
                        );
                    }
                },
                {
                    from: path.join(__dirname, '../src/web/components/**/*.html'),
                    to: "../components",
                    transformPath(targetPath) {
                        // 修正一下路径问题，上面匹配 ** 后会产生多余的目录结构
                        return targetPath.replace("src/web/components", "");
                    },
                    transform(content) {
                        return minify(content.toString(), { collapseWhitespace: true });
                    }
                },
            ],
        }),
    ]
}