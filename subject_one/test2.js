/**
 * 1. 块级作用域、变量提升
 */
// var yideng;
// var flag;
// var a;
console.log(a); //-->undefined
console.log(typeof yideng(a)); //-->TypeError not a function
var flag = true;
if (!flag) {
    var a = 1;
}
if (flag) {
    function yideng(a) {
        yideng = a; //对函数标识进行访问
        console.log("yideng1");
    }
    // 拓展 1
    // yideng = 123;
    // console.log('函数外对函数进行修改', yideng); //123

    // 拓展2
    // yideng = 123;
    // console.log('块内修改对内部有效', typeof yideng); //number
} else {
    function yideng(a) {
        yideng = a;
        console.log("yideng2");
    }
}
// console.log(typeof yideng(a)); //如果加上这行，输出 'yideng1'
// 拓展2
// console.log('块内修改对外部不影响', typeof yideng); //function

[讲解与拓展]
0. 考点：块作用域的变量提升、块级作用域内部的修改对外部不会产生影响

1. 答案及讲解
先说前面两行输出：首先编译器编译时进行变量提升，提升效果见代码开始注解，函数优于变量也会被提升出去。
之后执行代码，因为都是在未执行逻辑代码时就输出，所以第一个输出undefined，第二个TypeError。

2. 拓展1：函数内部函数名标识符受保护
首先：规范规定，函数名的标识符只能从函数内部访问，函数外部访问不到。绑定为函数名的标识符不能再绑定为其他值，也就是不可再修改。
在最后一行输出 yideng(a); 会输出 'yideng1'。虽然在函数内修改了函数名标识，但是修改无效，所以type依然是function。
如果在函数体外对函数标识进行修改，则会成功修改，见注解。

3. 拓展2：块级作用域内的修改不会影响外部
见注解，在if的块内对yideng进行修改，在全局输出 typeof yideng，依然是function，不会被影响。


/**
 * 1-1. 直播提到的
 */
function foo() {
    console.log(1);
}
(function () {
    // var foo; 这里会提升一个foo，覆盖了上面的foo
    if (false) {
        function foo() {
            console.log(2);
        }
    }
})();
foo(); //-->undefined


/**
 * 2 bind、this、arguments、严格模式
 */
function fn() {
    console.log(this.length);
}
var yideng = {
    length: 5,
    method: function () {
        "use strict";
        fn(); //-->0 window.length = iframe的个数
        arguments[0](); //-->2 
    }
}
const result = yideng.method.bind(null); //软绑 相当于没绑
result(fn, 1);

[讲解与拓展]
1. 答案及讲解
第一个知识点：bind(null); 软绑，相当于没绑定this。
按照代码执行，执行fn(), 这时因为严格模式不在fn函数内，所以this指向window。注意：此时如果严格模式在fn函数内，this是undefined，那么.length会报错

第二个知识点：window.length -> iframe的个数。所以输出0。
继续执行arguments[0]()

第三个知识点：函数arguments.length是实参的数目，所以此时arguments[0]是fn，执行fn，this指向arguments对象，因此length为2


/**
 * 2-1 arguments
 */
function yideng(a, b, c) {
    console.log(this.length); //-->4 (fn arguments的length)
    console.log(this.callee.length); //-->1 
}
function fn(d) {
    arguments[0](10, 20, 30, 40, 50); //arguments.yideng(10, 20, 30, 40, 50)
}
fn(yideng, 10, 20, 30);

[讲解与拓展]
1. 第一处输出看看上面的题就懂了，见注解。
2. 第二行输出，this指向arguments，arguments.callee指向正在执行的函数，也就是fn，length是1


/**
 * 3. 请问变量a会被GC回收么，为什么呢？
 */
function test() {
    var a = "yideng";
    return function () {
        eval("");
    }
}
test()();

[讲解与拓展]
0. 考点：(词法作用域 Lexical Scoping) 欺骗作用域、eval、闭包
1. 解答：不会被回收
先来分析一波：
乍看上面的代码，像闭包，但是又没有像平常的闭包一样引用变量。那么是不是不叫闭包呢？
这个涉及到闭包的概念了，如果没有eval那行，确实不会在执行栈中产生一个闭包，但是被返回的这个函数是具有闭包的能力的，只是它没有用而已。
所以接下来继续讲加上eval之后的情况：eval() 在执行时会产生一个闭包，哪怕是像上面这个eval里并没有任何引用(引擎并不知道你有没有引用，所以会保留作用域链) 。
这个可以在控制台的执行栈看到产生的闭包。所以a无法被回收。

但是又有一个问题，test()(); 执行完毕了，为什么还是不会被回收？也没有人再引用这个产生的闭包了。
答案依然是不会立刻回收，为什么呢？
第一，垃圾回收并不是即时回收的。
第二，JS里要回收需要把它手动销毁，置为null，也就是把 test()(); 置为null。
第三，回收要等到AO被推出栈才可能执行回收；对于这个题，那就是整个页面销毁了，才会被回收。
第四，闭包在内存中会被放在堆中，不会被销毁。


2. 拓展

「先就本题自身做一个拓展」
2.1 JS执行时会把所有代码包裹在一个闭包内，在执行栈会有一个匿名函数。也就是说即使上面代码中没有闭包，其实在执行栈中依然会产生一个闭包。（这个点面试时慎重做答）
2.2 课堂提问：eval既然会产生闭包又不会被回收，为什么webpack打包还会用eval实现？答：方便调试。直接把代码丢进eval，进去是JS，出来也是JS代码，还不会对webpack自身代码产生影响。
❗️ 这个2.2其实我目前还不熟悉这块的代码，先记下，之后再回头看这个。
2.3 在浏览器查看堆内存快照？
在Memory进行录制，会生成堆内存快照。
2.4 如果是 window.eval(""); 就会被回收掉了，因为调用的地方 方式不同。（这里也不甚明白，先记住吧）

「欺骗作用域 拓展」
这个小黄书一也提到了，try catch；with；eval
with可能会导致变量泄露至全局的问题（with的对象内无要使用的变量，非严格模式下就会在全局创建一个变量出来）；with也可能导致对变量产生不在预期内的误修改

[小总结]
eval()会在执行栈中产生一个闭包，其实本质是会保存作用域，因为引擎不知道eval内的代码是啥（eval需要调用JS解释器将其转为机器代码）。所以不会被垃圾回收掉。
所以不要使用eval，会导致很多垃圾无法被回收等问题。



/**
 * 4 原型链
 */
Object.prototype.a = 'a';
Function.prototype.a = 'a1';
function Person() { };
var yideng = new Person();
console.log(Person.a); //-->a1，是个函数，找函数Function
console.log(yideng.a);//-->a，是个对象，找Object
console.log(1..a);
console.log(1.a);
console.log(yideng.__proto__.__proto__.constructor.constructor.constructor); //-->function Function(){}

[讲解与拓展]
1. 先把涉及原型链输出的最后一行讲一下。我自己比较晕的地方是有关函数的这条链，所以梳理一下：

（1）所有函数(function ...(){ })都是Function的实例，其__proto__指向 Function.prototype；
（2）Function.prototype.constructor 指向 function Function() { } ，function Function() { } 也是Function的实例，__proto__指回 Function.prototype
（3）Function.prototype 是个对象，由 Object 创造，所以 Function.prototype.__proto__ 指向 Object.prototype
（4）容易记错的点：function Function() { } 也是Function的实例，__proto__指回 Function.prototype，而不是作为对象指向 Object.prototype
（5）Function.prototype 是什么？ 是平台代码（Chorme的代码...之类的）
[总结] 函数的这一系列原型链比较特殊，会形成一个环，函数自己创造自己。所以别弄错。

2. 解答
回到题上，yideng.__proto__.__proto__.constructor是function Object(){ } ，这里是无疑问的，然后继续走后两个constructor
倒数第二个：function Object() { } 是Function的实例，所以沿着原型，找回了Function.prototype.constructor -> function Function() { }
最后一个：function Function() { } 也是Function的实例，又沿着原型，再一次走了一个环找回 Function.prototype.constructor -> function Function() { }

3. 在捋清楚上面的东西之后，再看下面的代码及注解
Object.prototype.a = 'a';
function Person() { };
console.log(Person.a); //a，Function也是Object创造出来的，一切皆对象


/**
 * 5
 */
// var test;
// var a;
{
    var a = 1;
    const b = 2; //不提升
    function test() { }
    test = 3;
    console.log(typeof test); //-->number
}
console.log(a); //-->1
console.log(typeof test); //-->function 
console.log(b); //-->ReferenceError, b is not defined

[讲解与拓展]
0. 考点：块作用域、内层作用域对外层的“遮蔽效应”
1. 浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于var声明的变量。


2“00”00之后
/**
 * 6. 请写出你了解的ES6元编程
 */
[讲解与拓展]
扩充语言的能力，对JS语言本身进行编程。我的理解是：重写或者扩充JS源语言的功能或者API


/**
 * 7. 请按照下方要求作答，并解释原理?请解释下babel编译后的async原理
 */
let a = 0;
let yideng = async () => {
    a = a + await 10;
    console.log(a);
}
yideng();
console.log(++a);

[讲解与拓展]



/**
 * 7-1
 */
async function async1() {
    console.log(1);
    await async2();
    console.log(3);
}
async function async2() {
    console.log(2);
}
async1();
console.log(4);

[讲解与拓展]
0.
1. 答案：1 2 3 4


/**
 * 8. 请问点击<buttion id=“test”></button>会有反应么?为什么?能解决么?
 */
$('#test').click(function (argument) {
    console.log(1);
});
setTimeout(function () {
    console.log(2);
}, 0);
while (true) {
    console.log(Math.random());
}

[讲解与拓展]
0. 考点：JS执行机制、事件循环
1. 答案：不会



/**
 * 9. 请先书写如下代码执行结果，并用ES5实现ES6 Promise A+规范的代码，同时你能解释下如何使用Promise完成事物的操作么?
 */
const pro = new Promise((resolve, reject) => {
    const innerpro = new Promise((resolve, reject) => {
        setTimeout(() => { resolve(1); });
        console.log(2);
        resolve(3);
    });
    innerpro.then(res => console.log(res));
    resolve(4);
    console.log("yideng");
});
pro.then(res => console.log(res));
console.log("end");


[讲解与拓展]
2 yideng end 3 4 1



/**
 * 10
 */
var s = [];
var arr = s;
for (var i = 0; i < 3; i++) {
    var pusher = {
        value: "item" + i
    }, tmp;
    if (i !== 2) {
        tmp = []
        pusher.children = tmp
    }
    arr.push(pusher);
    arr = tmp;
}
console.log(s[0]);

[讲解与拓展]




/**
 * 10-1. 请描述你理解的函数式编程，并书写如下代码结果。那么你能使用 Zone+RX 写出一段FRP的代码么?
 */
var Container = function (x) {
    this.__value = x;
}
Container.of = x => new Container(x);
Container.prototype.map = function (f) {
    return Container.of(f(this.__value))
}
Container.of(3).map(x => x + 1).map(x => 'Result is ' + x);

[讲解与拓展]



