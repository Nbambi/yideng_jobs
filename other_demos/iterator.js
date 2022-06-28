/**
 * 实现迭代器
 * @param {*} obj 
 */

// 方式一
let addIterator = function (obj) {
    obj[Symbol.iterator] = function () {
        let index = 0;
        const _this = this;
        const keys = Object.keys(_this);
        const len = keys.length;
        // 返回 next(), 一个闭包, 返回当前成员的信息
        return {
            next() {
                if (index < len) {
                    return {
                        value: _this[keys[index++]],
                        done: false,
                    };
                }
                //迭代至最后一个元素
                return {
                    value: null,
                    done: true,
                };
            },
        };
    };
}

// 方式二
let addIterator = function (obj) {
    // 使用 Generator版
    obj[Symbol.iterator] = function* () {
        const keys = Object.keys(this);
        for (let i = 0, len = keys.length; i < len; i++) {
            yield this[keys[i]];
        }
    };
}


// 测试
let obj = { a: 1, b: 2, c: 3 };
addIterator(obj);
for (const item of obj) {
    console.log(item);
}
// 1
// 2
// 3