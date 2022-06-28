const fs = require('fs');
// const parser = require('babylon');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const MagicString = require('magic-string');
const entry = './index.entry.js';

function parse(filename) {
    // 拿到代码内容
    const content = fs.readFileSync(filename, 'utf-8');
    const code = new MagicString(content);

    // 生成AST
    const ast = parser.parse(content, { sourceType: "module" });
    console.log('------ AST ------', ast);

    // 遍历AST
    traverse(ast, {
        ImportDeclaration({ node }) {
            const { start, end, specifiers, source } = node;
            console.log('--- node --- :', node);
            // 把 require 转成 __webpack_require__
            code.overwrite(
                start,
                end,
                `var ${specifiers[0].local.name} = __webpack_require__("${source.value}").default`
            )
        },
    });
    return code.toString();
}

const result = parse(entry);
fs.writeFileSync('./dist/ast.js', result);

