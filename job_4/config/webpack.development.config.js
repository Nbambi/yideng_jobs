const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    watch: true,
    plugins: [
        // 拷贝组件到打包后的项目中 dist，打包后文件不压缩
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../src/web/views/layouts/index.dev.html'),
                    to: "../views/layouts/index.html"  //to的路径基于output.path
                },
                // 这里只 cp html 即可了，js/css都提出去了
                {
                    from: path.join(__dirname, '../src/web/components/**/*.html'),
                    to: "../components",
                    transformPath(targetPath) {
                        // 修正一下路径问题
                        return targetPath.replace("src/web/components", "");
                    }
                },
            ],
        }),
    ]
}