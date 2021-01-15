/**
 * 浏览器中的 Eventloop
 */


/**
 * 1. 宏任务与微任务的执行顺序
 */
setTimeout(() => {
    console.log("timeout"); //异步 宏任务
}, 0);

const promise = new Promise(resolve => {
    //下面这些代码都是同步执行代码
    console.log("promise init"); //同步代码
    resolve(1);
    console.log("promise end"); //同步代码
});

promise.then(res => { //.then返回Promise对象，是典型的微任务
    //下面是异步回调代码，是异步执行的代码，也就是要排到异步队列里的
    console.log("promise result:", res);
});

console.log("end"); //同步代码

[讲解]
执行结果与顺序：
1. 同步代码：promise init、 promise end、 end、
2. 微任务：promise result: 1、
3. 宏任务：timeout

/**
 * 2. 宏任务微任务交错执行
 */
setTimeout(() => {
    console.log("timeout 1");
    Promise.resolve().then(() => {
        console.log("promise 1");
    });
}, 0);

Promise.resolve().then(() => {
    console.log("promise 2");
    setTimeout(() => {
        console.log("timeout 2");
    }, 0);
});

[讲解]
promise2、timeout1、promise1、timeout2
插入宏任务t1，插入微任务p2。
先执行微任务p2，p2内插入宏任务t2。执行完毕检查，无其他微任务。
所以执行下一个宏任务t1，并插入一个微任务p1。执行t1完毕检查有无微任务，有，执行p1。
执行下一个宏任务t2。结束。

/**
 * 3. async await
 */
async function fn() {
    return await 1234;
    // return Promise.resolve(1234); ES6规范，上面代码会被转为这个样子
}
fn().then(res => console.log(res)); //1234

[讲解]
ES6规范：await命令后正常情况下应该是Promise对象，如果不是，会被转为promise对象并立即resolve
所以 await 1234; 的效果等同于 Promise.resolve(1234); 执行函数并.then会接收到参数1234

// 3-1 await enable
async function fn() {
    return ({
        then(resolve) {
            resolve({
                //遇到thenable对象，那么会递归使用promise.then调用；直到resolve返回值是一个基础类型
                then(r) {
                    r(1); //1
                }
            })
        }
    });
}
fn().then(res => console.log(res)); //1

[讲解] 见注解


/**
 * 4. 使用 async await 顺序判断
 */
async function async1() {
    console.log("async1 start"); //同步任务

    await async2(); //同步任务, 被转为promise对象并立即resolve, 如下面注释掉的代码
    // new Promise(resolve => {
    //     console.log("async2");
    //     resolve();
    // }).then(() => console.log("async1 end"));

    console.log("async1 end"); //异步，微任务
}
async function async2() {
    console.log("async2");
}
async1();
console.log("end");

[讲解] 见注解
async1 start
async2
end
async1 end


/**
 * 5. 如果 promise 没有  resolve 或 reject
 */
async function async1() {
    console.log("async1 start");
    await new Promise(() => {
        console.log("promise1");
        // 该Promise没有改变promise状态，所以后面的代码永远不会执行
    });
    console.log("async1 success");
    return "async1 end";
}

console.log("script start");
async1().then(res => { console.log(res) });
console.log("script end");

[讲解] 见注解
script start
async1 start
promise1
script end


/**
 * 6. 大厂真实面试题
 */
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end"); //注册微任务，顺序1
}

async function async2() {
    console.log("async2");
}

console.log("script start");

setTimeout(function () { //注册宏任务
    console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
    console.log("promise 1");
    resolve();
}).then(function () { //注册微任务，顺序2
    console.log("promise 2");
}).then(function () { //注册微任务，顺序3
    console.log("promise 3");
}).then(function () { //注册微任务，顺序4
    console.log("promise 4");
});

console.log("script end");

[讲解] 见注解 未标注的是同步代码
script start
async1 start
async2
promise 1
script end
async1 end
promise 2
promise 3
promise 4
setTimeout


/**
 * 7. resolve 处理
 */
async function async1() {
    console.log("async1 start");
    return new Promise(resolve => {
        resolve(async2());
    }).then(() => { //注册微任务，顺序1
        console.log("async1 end");
    });
}

function async2() {
    console.log("async2");
}

setTimeout(() => { //注册宏任务，顺序1
    console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(() => {
    console.log("promise2"); //注册微任务，顺序2
}).then(() => {
    console.log("promise3"); //注册微任务，顺序3
}).then(() => {
    console.log("promise4"); //注册微任务，顺序4
});

[讲解] 见注解
async1 start
async2
promise1
async1 end
promise2
promise3
promise4
setTimeout

/**
 * 7-1. 变式
 */
async function async1() {
    console.log("async1 start");
    return new Promise(resolve => {
        // resolve 处理 thenale 会再包裹一层 promise
        resolve(async2()); //async2 本身会返回一个 promise
    }).then(() => {
        console.log("async1 end");
    });
}

async function async2() { //基于7改变了这个函数
    console.log("async2");
}

setTimeout(() => {
    console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(() => {
    console.log("promise2");
}).then(() => {
    console.log("promise3");
}).then(() => {
    console.log("promise4");
});

[讲解]
0. 输出顺序如下：
async1 start
async2
promise1
promise2
promise3
async1 end
promise4
setTimeout
1. 见注解，按照没有修改为 async 方法的顺序，因为多包裹了两层，所以回调函数也被推后了两个位置



/**
 * NodeJs 中的 EventLoop
 */

/**
 * 1. 比较 setImmediate 和 setTimeout 的执行顺序
 */
setTimeout(_ => console.log("setTimeout"));
setImmediate(_ => console.log("setImmediate"));

[讲解]
输出时顺序不一定谁先谁后。因为在poll阶段是timer不一定有没有加入队列，timer不一定立马被加入队列，因此timer可能无法先与Immediate执行。

/**
 * 1-1. 如果两者都在一个 poll 阶段注册，那么执行顺序就能确定
 */
const fs = require("fs");
const { nextTick } = require("process");
fs.readFile("./read.md", () => {
    setTimeout(_ => console.log("setTimeout"));
    setImmediate(_ => console.log("setImmediate"));
});

[讲解]
setImmediate
setTimeout
poll阶段执行，注册timer，进入check阶段。结束tick，进行下一次tick，执行timer。

/**
 * 2. 理解 process.nextTick
 */
function apiCall(arg, callback) {
    if (typeof arg !== 'string') {
        return process.nextTick(
            callback,
            new TypeError("arg should be string")
        );
    }
}

[讲解与拓展]
NodeJs中API第一个参数是error，如何实现传递？运用nextTick，在下一个执行阶段之前输出错误信息。
为了不让程序直接因为错误停止运行，在这个时候抛出错误。


/**
 * 3. 比较 process.nextTick 和 setImmediate
 */
setImmediate(_ => console.log("setImmediate"));
process.nextTick(_ => console.log("nextTick"));

[讲解与拓展]
nextTick
setImmediate


/**
 * 不同版本 node
 */
/**
 * 1. timer阶段
 */
setTimeout(() => {
    console.log("timer1");
    Promise.resolve().then(() => {
        console.log("promise1");
    });
}, 0);
setTimeout(() => {
    console.log("timer2");
    Promise.resolve().then(() => {
        console.log("promise2");
    });
}, 0);
// node11之前
timer1 timer2 promise1 promise2
// node11之后
timer1 promise1 timer2 promise2


/**
 * 2. check阶段
 */
setImmediate(() => console.log("setImmediate1"));
setImmediate(() => {
    console.log("setImmediate2");
    Promise.resolve().then(() => {
        console.log("promise1");
    });
});
setImmediate(() => console.log("setImmediate3"));
setImmediate(() => console.log("setImmediate4"));

// node11之前
setImmediate1 setImmediate2 setImmediate3 setImmediate4 promise1
// node11之后
setImmediate1 setImmediate2 promise1 setImmediate3 setImmediate4


/**
 * 3. nextTick
 */
setImmediate(() => console.log("1"));
setImmediate(() => {
    console.log("2");
    process.nextTick(() => { console.log("5") });
});
setImmediate(() => console.log("3"));
setImmediate(() => console.log("4"));

// node11之前
12345
// node11之后
12534
