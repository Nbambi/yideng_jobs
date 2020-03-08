var _ = function (obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj; // [1,2,3,4,5]
};

_.each = (array, callback) => {
    for (let i = 0; i < array.length; i++) {
        callback(array[i], i);
    }
};

_.isFunction = function (obj) {
    return typeof obj == "function" || false;
};

_.functions = function (obj) {
    // underscore 也就是 _
    var names = [];
    for (var key in obj) {
        if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
};

_.mixin = function (obj) {
    const funcs = _.functions(obj);
    _.each(funcs, function (name) {
        var func = obj[name];
        //  柯里化
        _.prototype[name] = function () {
            var args = [this._wrapped];
            Array.prototype.push.apply(args, arguments);
            func.apply(_, args);
        };
    });
    return _;
};

_.mixin(_);

// _.each([1, 2, 3, 4, 5], item => {
//   console.log("静态资源方法：", item);
// });

// _([1, 2, 3, 4, 5]).each(item => {
//   console.log("原型上的方法：", item);
// });

/**
 * 节流
 *      每隔一段的时间，只会执行一次，即使是触发多次
 *      PS:这个小节流没有考虑到最后一次执行的情况
 *  */ 
_.throttle = function (func, timer) {
    let timout = null;
    return () => {
        if (timout) {
            return;
        }
        timout = setTimeout(() => {
            timout = null;
        }, timer);
        func();
    };
};

function log() {
    console.log("打印");
}

const logThrottle = _.throttle(log, 1000);

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
