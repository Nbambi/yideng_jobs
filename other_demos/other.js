class Deferred {
    constructor(callback) {
        this.value = undefined
        this.status = STATUS.PENDING

        this.rejectQueue = []
        this.resolveQueue = []

        let called // 用于判断状态是否被修改
        const resolve = value => {
            if (called) return
            called = true
            // 异步调用
            setTimeout(() => {
                this.value = value
                // 修改状态
                this.status = STATUS.FULFILLED
                // 调用回调
                for (const fn of this.resolveQueue) {
                    fn(this.value)
                }
            })
        }
        const reject = reason => {
            if (called) return
            called = true
            // 异步调用
            setTimeout(() => {
                this.value = reason
                // 修改状态
                this.status = STATUS.REJECTED
                // 调用回调
                for (const fn of this.rejectQueue) {
                    fn(this.value)
                }
            })
        }
        try {
            callback(resolve, reject)
        } catch (error) {
            // 出现异常直接进行 reject
            reject(error)
        }
    }


    then(onResolve, onReject) {
        if (this.status === STATUS.PENDING) {
            // 将回调放入队列中
            const rejectQueue = this.rejectQueue
            const resolveQueue = this.resolveQueue
            return new Deferred((resolve, reject) => {
                // 暂存到成功回调等待调用
                resolveQueue.push(function (innerValue) {
                    try {
                        const value = onResolve(innerValue)
                        // 改变当前 promise 的状态
                        resolve(value)
                    } catch (error) {
                        reject(error)
                    }
                })
                // 暂存到失败回调等待调用
                rejectQueue.push(function (innerValue) {
                    try {
                        const value = onReject(innerValue)
                        // 改变当前 promise 的状态
                        resolve(value)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        } else {
            const innerValue = this.value
            const isFulfilled = this.status === STATUS.FULFILLED
            return new Deferred((resolve, reject) => {
                try {
                    const value = isFulfilled
                        ? onResolve(innerValue) // 成功状态调用 onResolve
                        : onReject(innerValue) // 失败状态调用 onReject
                    resolve(value) // 返回结果给后面的 then
                } catch (error) {
                    reject(error)
                }
            })
        }
    }
}


