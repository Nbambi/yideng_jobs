const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    watch: true,
    plugins: [
        // 拷贝组件到打包后的项目中 dist，打包后文件不压缩
        new CopyPlugin({
            patterns: [
                { from: path.join(__dirname, '../src/web/views/layouts'), to: "../views/layouts" }, //to的路径基于output.path
                { from: path.join(__dirname, '../src/web/components'), to: "../components" },
            ],
        }),
    ]
}