/**
 * AOP实战demo
 * 
 * 要注意的一些点：
 *      1. 可以直接把函数挂载在 Function.prototype 上，在返回时返回 function，实现链式调用；同时也避免了重复执行函数本身
 *      2. 在执行挂载的函数时，要注意保存 this，方便对 this 进行修正
 *      3. 不能影响函数本身（本例中是test函数）的 return，所以一定要在挂载的函数中把函数本身的结果 return 出去
 * 
 * 运行看效果：node aop.demo.js
 */



/**
 * 往 Function 原型链上挂载 _logBefore
 * @param {*} dosomethingBeforeFn 函数，在执行业务函数前做的事情
 * @returns 
 */
Function.prototype._logBefore = function (dosomethingBeforeFn) {
    //保存当前函数
    let _self = this;
    // 返回一个函数，这样可以链式调用
    // 如果不写成返回函数，而是直接执行两个函数会产生一个问题（如果after里也这样实现）：原本的函数会被执行两次，因为before和after里都执行了一遍
    return function () {
        // before，先执行 beforeFn，再执行原本函数
        dosomethingBeforeFn.apply(_self, arguments);

        /**
         * FIXME
         *  当然，在这里是可以拿到这两个函数（_self、dosomethingBeforeFn）的执行结果去做一些逻辑判断等事情的，比如函数和执行返回了false就终止下面的执行直接退出：比如下面被注释掉的这行：
         *  这样如果执行后是 false，就直接返回出去了，不会执行当前函数本身了
         */
        // if (dosomethingBeforeFn.apply(_self, arguments) === false) return false;

        var result = _self.apply(_self, arguments); //原本的函数执行的结果
        return result; //原本函数的执行结果要返回出去
    }
}

/**
 * 往 Function 原型链上挂载 _logAfter
 * @param {*} dosomethingAfterFn 函数，在执行业务函数后做的事情
 * @returns 
 */
Function.prototype._logAfter = function (dosomethingAfterFn) {
    let _self = this;
    return function () {
        // after，先执行原本函数，再执行 afterFn
        var result = _self.apply(_self, arguments);
        dosomethingAfterFn.apply(_self, arguments);
        return result;
    }
}

function test() {
    alert('testFn');
    return 'test return msg';
}

// 调用时先调用哪个没关系，因为在挂载的函数内执行顺序不会乱
test
    ._logAfter(() => { alert('AfterFn') })
    ._logBefore(() => { alert('BeforeFn') })
    ();
