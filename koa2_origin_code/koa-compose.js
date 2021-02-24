/**
 * Koa中间件源码分析 https://mp.weixin.qq.com/s/PJtbxyu1TK7NFv4MH2l4nQ
 * koa-compose github : https://github.com/koajs/compose/blob/master/index.js
 */

 'use strict';
/**
 * 组合中间件函数
 *  返回一个函数 调用这个函数会从中间件列表中拉取一个中间件进行执行
 *  返回的函数一经调用就会递归执行，直到遍历完中间件列表
 * 
 * @param {*} middleware 中间件列表
 * @return {Function}
 */
function compose(middleware) {
    // 中间件列表、函数校验
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (let fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }

    /**
     * 返回的函数 递归调用中间件列表
     */
    return function () {
        let index = -1; //当前执行的中间件下标，在返回的闭包函数中调用保持下标变量引用
        return dispatch(0); //首次调用从下标 0 开始

        function dispatch(nextIndex) {
            if (nextIndex <= index) return Promise.reject(new Error('next() called multiple times'))
            index = nextIndex;
            let fn = middleware[index]; //从中间件列表中取出一个中间件
            if (!fn) return Promise.resolve(); //如果最后一个中间件中调用了next，依然会返回Promise而不是undefined之类

            // 利用 Promise 的状态进行异常情况的捕获
            try {
                return Promise.resolve(fn(dispatch.bind(null, index + 1)));
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
}

module.exports = compose


// main
let middleware = [];
async function md1(next) {
    console.log('md1 start');
    await next();
    console.log('md1 end');
}
async function md2(next) {
    console.log('md2 start');
    await new Promise((res, rej) => {
        setTimeout(() => {
            console.log('async task in md2')
            res();
        }, 500)
    })
    await next();
    console.log('md2 end');
}
async function md3(next) {
    console.log('md3 start');
    await next();
    console.log('md3 end');
}
middleware.push(md1, md2, md3);
compose(middleware)();
