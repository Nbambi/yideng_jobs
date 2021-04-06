const fs = require('fs'); //因为要读取、输出文件，所以需要这个模块
const ejs = require('ejs'); //使用模板生成 Template
const entry = './index.entry.js'; //入口
const output = './dist/main.js'; //出口

const getEntry = fs.readFileSync(entry, 'utf-8');

let template = `(function (modules) {
    function __webpack_require__(moduleId) {
        const module = {
            exports: {}
        }
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
    }
    return __webpack_require__(0);
}([
    function (module, exports, __webpack_require__) {
        <%- getEntry %>
    }
]));`;

let result = ejs.render(template, { getEntry }); //模板生成页面
fs.writeFileSync(output, result);
