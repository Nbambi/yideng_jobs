/**
 * Promise 简洁完整版本
 */

const STATUS = {
    PENDING: 'pending', //Promise的初识状态
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

/**
 * promise 结果处理函数
 * 
 * @param {*} promise2 当前 promise 对象
 * @param {*} x 返回值
 * @param {*} resolve 当前对象的 resolve
 * @param {*} reject 当前对象的 reject
 */
function promiseResolutionHandler(promise2, x, resolve, reject) {
    // 返回值为当前promise对象, 循环引用, 抛出异常
    if (promise2 === x) {
        throw new Error('循环引用 promise"');
    }
    // 如果返回值是 promise 对象
    if (x instanceof MyPromise) {
        if (x.status === STATUS.PENDING) {
            // x 还在处理态, 放入回调(递归处理结果 新的结果是y), 等 x 执行完毕后执行
            x.then((y) => {
                promiseResolutionHandler(promise2, y, resolve, reject);
            }, reject);
        } else {
            // x 处理结束, 则可以直接改变当前对象p2状态了
            x.status === STATUS.FULFILLED && resolve(x.value)
            x.status === STATUS.REJECTED && reject(x.value)
        }
    }
    // 如果是 thenable 对象 
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        if (x.then && typeof x.then === 'function') {
            x.then(y => {
                promiseResolutionHandler(promise2, y, resolve, reject);
            }, reject);
        } else {
            // 虽然有 then, 但不是函数, 等同于普通的值, 直接 resolve
            resolve(x);
        }
    } else {
        // 上述情况均未命中, 普通的值, 直接 resolve
        resolve(x);
    }
}


class MyPromise {
    constructor(executor) {
        this.status = STATUS.PENDING; //定义初始状态为PENDING
        this.value = undefined; //存储对象值 [[PromiseResult]], fulfilled value 或者 rejected reason
        this.resolveQueue = []; //在对象状态由 PENDING->FULFILLED 后依次执行
        this.rejectQueue = []; //在对象状态由 PENDING->REJECTED 后依次执行

        const resolve = (value) => {
            if ((typeof value === 'object' || typeof value === 'function') && value.then) {
                promiseResolutionHandler(this, value, resolve, reject);
                return;
            }
            if (this.status === STATUS.PENDING) { //不是PEDNING状态表明Promise状态已经被修改, 则无法再次修改状态
                setTimeout(() => {
                    this.status = STATUS.FULFILLED; //改变状态
                    this.value = value; //保存结果
                    //执行回调队列, 将内部值传递进去
                    for (let callBack of this.resolveQueue) {
                        callBack(this.value);
                    }
                }, 0);
            }
        }
        const reject = (reason) => {
            if ((typeof value === 'object' || typeof value === 'function') && value.then) {
                promiseResolutionHandler(this, reason, resolve, reject);
                return;
            }
            if (this.status === STATUS.PENDING) {
                setTimeout(() => {
                    this.status = STATUS.REJECTED;
                    this.value = reason;
                    //执行回调队列
                    for (let callBack of this.rejectQueue) {
                        callBack(this.value);
                    };
                }, 0);
            }
        }
        try {
            executor(resolve, reject); //调用回调函数的时候 需要提供resolve、reject函数出去
        } catch (err) {
            reject(err); //如有异常, 直接调用reject
        }
    }

    /**
     * Promise.prototype.then()
     * 
     * @param {*} onFulfilled 回调函数(该函数接收Promise传出的value作为参数)
     * @param {*} onRejected 回调函数(该函数接收Promise传出的value作为参数)
     * @returns 返回一个新的Promise对象 
     */
    then(onFulfilled, onRejected) {
        // 0. 值穿透处理, 判断参数类型: 如果不是函数则直接返回当前值/抛出当前异常信息
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

        let promise2 = new Promise((resolve, reject) => {
            switch (this.status) {
                // 1. 还在执行中, 将回调放入队列中; 这种情况下是异步调用的
                case STATUS.PENDING:
                    // 1.1 暂存 onFulfilled
                    this.resolveQueue.push((innerValue) => {
                        // 形参在上一个对象状态改变后调用回调时会将上一个执行结果作为实参传入
                        const value = onFulfilled(innerValue);
                        // 不是简单的直接 resolve, 而是调用处理方法对返回值进行处理
                        promiseResolutionHandler(promise2, value, resolve, reject);
                    });

                    // 1.2 暂存 onRejected
                    this.rejectQueue.push((innerReason) => {
                        const reason = onRejected(innerReason);
                        promiseResolutionHandler(promise2, reason, resolve, reject);
                    })
                    break;

                // 2. 执行完成, 直接调用回调, 将存储的执行结果传入; 这种情况下是同步调用的
                case STATUS.FULFILLED:
                    const value = onFulfilled(this.value);
                    promiseResolutionHandler(promise2, value, resolve, reject);
                    break;

                case STATUS.REJECTED:
                    const reason = onRejected(this.value);
                    promiseResolutionHandler(promise2, reason, resolve, reject);
                    break;
            }
        });
        return promise2;
    }

    catch(onError) {
        return this.then(null, onError);
    }

    finally(onDone) {
        if (typeof onDone !== 'function') return this.then();
        let Promise = this.constructor;
        return this.then(
            value => {
                // 转为 Promise 对象, 执行 onDone 函数操作; 然后将之前对象的执行结果值返回
                Promise.resolve(onDone()).then(() => value)
            },
            reason => {
                Promise.resolve(onDone()).then(() => { throw reason })
            }
        )
    }

    static resolve(value) {
        // 1. 参数是 Promise 实例, 直接返回该对象
        if (value instanceof MyPromise) return value;
        // 2. 参数是 thenable 对象
        if (
            value !== null && (typeof value === 'object' || typeof value === 'function') &&
            value.then && typeof value.then === 'function'
        ) {
            return new MyPromise((resolve, reject) => {
                value.then(resolve); //作为构造函数的实参传入, 立即执行
            });
        }
        if (value) {
            // 3. 有参数, 返回 Fulfilled 状态的 Promise 对象, 对象执行结果为传入的参数
            return new MyPromise(resolve => resolve(value))
        } else {
            // 4. 无参数, 直接返回 Fulfilled 状态的 Promise 对象
            return new MyPromise(resolve => resolve())
        }
    }

    static reject(value) {
        return new MyPromise((resolve, reject) => reject(value));
    }

    static all(promiseArr) {
        return new MyPromise((resolve, reject) => {
            let successNum = 0;
            let resultArr = [];
            let totalNum = promiseArr.length;

            for (let i = 0; i < totalNum; i++) {
                // 调用 MyPromise.resolve 是为了保证对象是 Promise 对象
                MyPromise.resolve(promiseArr[i]).then(
                    result => {
                        successNum++;
                        resultArr[i] = result;
                        if (successNum === totalNum) {
                            // 全部处理成功, 返回执行结果数组
                            resolve(resultArr);
                        }
                    },
                    // 处理失败, 返回首个报错对象的错误信息
                    err => reject(err)
                );
            }
        });
    }

    static race(promiseArr) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < promiseArr.length; i++) {
                MyPromise.resolve(promiseArr[i]).then(
                    result => resolve(result),
                    err => reject(err)
                );
            }
        });
    }

    static allSettled(iterators) {
        let promiseArr = Array.from(iterators);
        let total = promiseArr.length;
        let resultList = new Array(total); //返回结果数组, 长度给定参数的长度
        let resultNum = 0; //记录完成执行的对象个数

        /**
         * 构造结果对象
         * @param {*} success 是否成功
         * @param {*} value 执行结果
         * @returns 
         */
        function formatSettledResult(success, value) {
            return success ?
                { status: 'fulfilled', value } :
                { status: 'rejected', reason: value };
        }

        return new MyPromise((resolve, reject) => {
            promiseArr.forEach((promise, index) => {
                MyPromise.resolve(promise)
                    .then(value => {
                        resultList[index] = formatSettledResult(true, value);
                        if (++resultNum === total) {
                            resolve(resultList);
                        }
                    })
                    .catch(err => {
                        resultList[index] = formatSettledResult(false, err);
                        if (++resultNum === total) {
                            resolve(resultList);
                        }
                    })
            });
        });
    }
}




/**
 * test1: 测试基本功能是否满足
 */
new MyPromise(resolve => {
    // 定时器模拟异步请求
    setTimeout(() => {
        resolve(1)
    }, 2000);
}).then(val1 => {
    console.log('val1', val1);
    return val1 * 2;
}).then(val2 => {
    console.log('val2', val2);
    return val2 * 2;
}).then(

).then(
    console.log('empty then')
).then(val3 => {
    console.log('val3', val3);
    return val3 * 2;
}).then(val4 => {
    console.log('val4', val4);
    return val4;
});



/**
 * test2: 测试返回值为 promise 的情况
 */
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        let id = 1;
        resolve(id);
    }, 1000);
}).then(id => {
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            usr = { name: 'bambi', id: id };
            resolve(usr);
        }, 1000);
    });
}).then(usr => {
    console.log('show usr:', usr);
    return usr;
});



/***
 * test3 Promise.all & Promise.race
 */
let p1 = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
        resolve(1)
    }, 1000)
});
let p2 = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
        resolve(2)
    }, 2000)
});
let p3 = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
        resolve(3)
    }, 3000)
});
MyPromise.all([p3, p1, p2]).then(res => {
    console.log(res) // [3, 1, 2]
});
MyPromise.race([p3, p1, p2]).then(
    value => console.log('resolve->', value),
    reason => console.log('reject->', reason)
); // resolve-> 1



/**
 * test4 Promise.allSettled
 */
const p1 = MyPromise.resolve(1000);
const p2 = MyPromise.resolve(2000);
MyPromise.allSettled([p2, p1]).then((results) => {
    console.log(results);
});
