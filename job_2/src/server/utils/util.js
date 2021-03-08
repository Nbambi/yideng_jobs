/**
 * 学习 underscore、lodash 等书写一个简单的函数式编程工具库
 */

//工具库外层基本都是用一个闭包包裹起来达到函数级别的作用域隔离，这样函数内的变量不会对外造成污染
(function () {

    // 对环境进行判断，这部分的写法也值得借鉴
    // FIXME

    //初始化 _ 对象，暴露出来的对象很简单 _，架构思想：基于可插拔的架构
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        /**
         * 如果传入的对象是 _ 类型会返回该对象，如果不满足这个条件，那么传入的 obj 就是参数了
         * 这时会用 wrapped 把参数记录起来
         * 这行很关键，在 mixin() 的实现里会涉及到
         */
        this._wrapped = obj;
    };

    /**
     * 节流方法
     *      1. 每隔一段时间只会执行一次函数
     *      2. 第一次触发会立即执行
     *      3. 如果在间隔时间内触发 会在间隔末尾再执行一次
     * 
     * @param {*} callback 回调函数
     * @param {*} timer 节流时间/间隔时间
     */
    _.throttle = function (callback, timer) {
        let isFirst = true; //记录首次触发
        let lastExecDate = null; //记录上一次执行的时间
        let triggerFlag = null; //记录在间隔时间内触发的最新的一次定时器

        if (isFirst) {
            // 首次触发立即执行
            callback();
            lastExecDate = +new Date(); // +转换成时间戳
            isFirst = false;
        } else {
            const currentDate = +new Date();
            // 判断是否在生效间隔内
            if (currentDate - lastExecDate >= timer) {
                // 大于间隔 执行回调
                callback();
                lastExecDate = +new Date();
            } else {
                // 小于间隔 为点击生成一个标识 等到间隔结尾时执行
                if (triggerFlag) {
                    // 防止在间隔内疯狂被触发 所以只记录最新的一次 然后在结尾触发这一次
                    clearTimeout(triggerFlag);
                }
                const waitTime = lastExecDate + timer - +new Date(); //到这次间隔结束还需要的时间
                triggerFlag = setTimeout(() => {
                    callback();
                    lastExecDate = +new Date();
                }, waitTime);
            }
        }
    }

    _.isFunction = function (obj) {
        return typeof obj == "function" || false;
    }

    // 遍历对象上挂载的所有 function 的名称
    _.functions = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort(); //排序并返回
    }

    _.each = function (arr, callback) {
        if (Array.isArray(arr)) {
            for (let i = 0; i < arr.length; i++) {
                return callback(arr[i], i);
            }
        }
        return arr;
    }

    /**
     * 遍历 _ 对象上所有 function，整合传入的参数调用 _ 原型链上真正的函数进行执行
     * 
     * @param {*} obj _ 对象
     * @returns 
     */
    _.mixin = function (obj) {
        const funcs = _.functions(obj);
        _.each(funcs, function (name) {
            var func = obj[name]; //取到 fn_name 对应的真正函数
            //柯里化
            _.prototype[name] = function () {
                var args = [this._wrapped]; //这个取到的是传入的参数
                Array.prototype.push.apply(args, arguments); //整合参数
                func.apply(_, args); //调用函数 传入参数
            };
        });
        return _;
    }

    _.mixin(_); //执行 mixin 函数，遍历 _ 对象所有 function
    root._ = _;

})();


// ---------------------------------------------------------------------------------------------------------------------------------------
// 下面非工具库代码

/**
 * 下面两种写法都可以正确的输出数组的元素，第一种没什么疑问，为什么第二种写法也可以正常运行呢？
 * 玄机就在 mixin 函数里
 */
_.each([1, 2, 3, 4, 5], item => {
    console.log(item);
});
_([1, 2, 3, 4, 5]).each(item => {
    console.log(item);
});



const logThrottle = _.throttle(
    () => { console.log('假装我是个点击事件回调函数') },
    1000
);
//测试节流代码；或者写一个按钮 绑个点击事件也行的
logThrottle();
logThrottle();
logThrottle();
logThrottle();
logThrottle();
setTimeout(() => {
    logThrottle();
    logThrottle();
    logThrottle();
    logThrottle();
}, 1500);
