/**
 * 1 变量提升
 */
alert(a); //-->function a...
a(); //-->10
var a = 3;
function a() {
    alert(10);
}
alert(a); //-->3
a = 6;
a(); //-->TypeError, not a function
[讲解与拓展]
0. 考点：JS编译过程，变量提升，同名变量与函数，函数优于变量
1. a = 6 改变了a的类型，V8不推荐变化类型，会影响性能
2. VO AO其实一回事，只是在执行时将VO激活成了AO
3.()必须满足callable才能这样执行

/**
 * 1-1
 */
var x = 1, y = 0, z = 0;
function add(x) {
    return (x = x + 1);
}
y = add(x);
console.log(y); //-->4
function add(x) {
    return (x = x + 3);
}
z = add(x);
console.log(z); //-->4
[讲解与拓展]
0. 考点：同名函数变量提升覆盖，函数参数作用域
1. 函数内的(x = x + 3) ，如果换成 return (x = q + 3); 传入参数变为q，那么返回的x会顺着作用域链找到外面的x，会输出4 7


/**
 * 2 原型链 this
 */
this.a = 20;
function go() {
    // this = Object.create(go.prototype); new
    // this.__proto__ = go.prototype;
    console.log(this.a);
    this.a = 30;
    // return this;
}
go.prototype.a = 40;
var test = {
    a: 50, //->30
    init: function (fn) {
        fn();
        console.log(this.a);
        return fn;
    }
};
console.log((new go()).a); // new go()-->40 ; (new go()).a-->30
test.init(go); //-->20 50
var p = test.init(go); //-->30 50
p(); //-->30 
[讲解与拓展]
0. 考点：this 原型链 new做了什么
1. new做的事情：（引擎做的）创建一个对象，绑定原型，如果没有返回对象那么会返回被创建的对象。见上方注解的代码。
1.1 如果有其他返回对象那么会被打断
如果 return { a: 0 }，那么第一行会输出 40 0
如果 return 1；那么不会影响 return this，第一行依然输出 40 30

2. 函数调用：第一种 go() 调用是走called。第二种 new go() 调用走的是constructorable
3. fn(); 直接执行函数 this指向全局


/**
 * 2-1
 */
var num = 1;
function fn() {
    "use strict";
    console.log(this.num++);
}
function fn2() {
    console.log(++this.num);
}
(function () {
    "use strict";
    fn2(); //-->2
})();
fn();  //-->TypeError undefined
[讲解与拓展]
0. 考点：函数调用栈 严格模式


/**
 * 2-2 拓展题
 */
function C1(name) {
    if (name) {
        this.name = name;
    }
}
function C2(name) {
    this.name = name; //对象上有name属性 值为undefined
}
function C3(name) {
    this.name = name || 'fe'; //undefined||fe
}
C1.prototype.name = "yideng";
C2.prototype.name = "lao";
C3.prototype.name = "yuan";
console.log((new C1().name) + (new C2().name) + (new C3().name)); //yideng undefined fe

/**
 * 3. 请写出如下点击li的输出值，并用三种办法正确输出li里的数字 
 */
{/* <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
</ul> */}
var list_li = document.getElementsByTagName("li");
for (var i = 0; i < list_li.length; i++) {
    list_li[i].onclick = function () {
        console.log(i);
    }
}

[讲解与拓展]
// answer：会输出 5 5 5 5 5 5； 三种方法正确输出：
// <1> 使用let
var list_li = document.getElementsByTagName("li");
for (let i = 0; i < list_li.length; i++) {
    list_li[i].onclick = function () {
        console.log(i.innerText);
    }
}

// <2> 立即执行函数 传入参数i IFFE
var list_li = document.getElementsByTagName("li");
for (var i = 0; i < list_li.length; i++) {
    (function () {
        list_li[i].onclick = function () {
            console.log(i);
        }
    })(i);
}

// <3> 使用闭包 将变量保存在闭包作用域内
var list_li = document.getElementsByTagName("li");
for (var i = 0; i < list_li.length; i++) {
    list_li[i].onclick = (function (i) {
        return function () {
            console.log(i);
        }
    })(i);
}

// <4> 事件冒泡
var ul = document.getElementsByTagName("ul");
ul[0].onclick = function (e) {
    console.log(e.target.innerText);
}

// <5> for of 遍历 ES6 ❓ 得有 Symbol.iterator 属性，要是个可迭代对象 1:15:00左右
var list_li = document.getElementsByTagName("li");
for (let li of list_li) {
    li.onclick = function () {
        console.log(this.innerText);
    }
}


/**
 * 4 引用类型
 */
function test(m) { //传递了m的地址进这个函数
    m = { v: 5 } //里层m是函数内的变量，m指向该对象
}
var m = { k: 30 }; //外层m指向该对象的堆地址
test(m);
alert(m.v); //-->undefined，外层对象引用地址不受里层的影响
[讲解与拓展]
0. 考点：引用类型

/**
 * 5 块级作用域函数 ❓ 下去研究
 */
function fn() {
    console.log(1);
}
(function () {
    // fn的名字会被提到这里
    if (false) { //这里是块级作用域
        function fn() {
            console.log(2);
        }
    }
    fn(); //-->TypeError, not a function
})();
[讲解与拓展]
0. 考点：ES6块级作用域函数
1. 块级作用域只提升函数名，不提升函数体，所以fn被提升出去，默认是undefined。因为不走if内的代码，所以执行 undefined() 报错。


/**
 * 6. 请用一句话算出 0-100 之间学生的学生等级，如 90-100 输出为1等生、80-90 为2等生以此类推。不允许使用if switch等。
 */
[讲解与拓展]
function getResult(score) {
    return (score >= 90) ? '1等生' : (score >= 80) ? '2等生' : '3等生'; //我的答案
    // return 11 - Math.ceil(score / 10); (90, 100] (80, 90] //老师的答案
}

/**
 * 7. 请用一句话遍历变量a。(禁止用for 已知var a = “abc”)
 */
[讲解与拓展]
0. 考点：字符串转数组
1. 首先，不能用split，原因是：在正常情况下没问题，但是如果字符串中有特殊符号（比如苹果的表情等）就不支持了。

// <1> 我自己的答案...
console.log(Object.keys(a).map((item, index) => { console.log(a[item]) }));
// <2>
console.log(Array.from(str));
// <3> for of
for (let item of str) { console.log(item) }
// <4> ... 底层是 for of
console.log([...str]);


/**
 * 8. 请在下面写出JavaScript面向对象编程的混合式继承。并写出ES6版本的继承。
 * 要求：汽车是父类，Cruze是子类。父类有颜色、价格属性，有售卖的方法。Cruze子类实现父类颜色是红色，价格是140000,售卖方法实现输出如下语句：将 红色的Cruze买给了小王价格是14万。
 */
[讲解与拓展]
0. 考点：继承。听老董的，就搞懂下面两种ES5和ES6的写法就行。拓展点见注解。
1. ES6 写法 - 老董
class Car {
    // static age = 20; 
    // #agePrivate = 20; //私有属性 private
    constructor(color, price) {
        this.color = color;
        this.price = price;
    }
    say() {
        console.log(`${this.color}and${this.price}`);
    }
}
class Cruze extends Car {
    constructor(color, price) {
        super(color, price);
    }
}
let cruze = new Cruze('红色', 140000);
// Cruze.age; //20 ES6的继承，父类的静态属性也能被子类继承过来...这个就比较怪了
cruze.say();
2. ES5 写法 - 老董
function Car(color, price) {
    this.color = color;
    this.price = price;
}
Car.prototype.say = function () {
    console.log(`${this.color}and${this.price}`);
}
function Cruze(color, price) {
    Car.call(this, color, price);
}
Cruze.prototype = Object.create(Car.prototype, {
    constructor: { value: Cruze } //第二个参数是ES8，可以省了下面这行
});
// Cruze.prototype.constructor = Car;
Car.age = 10;
for (let [key, value] of Object.entries(Car)) { //Object.entries只遍历Car本身的属性
    Cruze[key] = value;
}
let cruze = new Cruze('红色', 140000);
console.log(Cruze.age);
cruze.say();


/**
 * 9. 请你写出如何利用EcmaScript6/7（小Demo）优化多步异步嵌套的代码？
 */
// answer
[讲解与拓展]
0. 考点：如何解决嵌套地狱
// <1> 使用 Promise.then 链式
// <2> async await 同步执行解决嵌套地狱

/**
 * 10 ❌ 不会
 */
var regex = /yideng/g;
console.log(regex.test('yideng'));
console.log(regex.test('yideng'));
console.log(regex.test('yideng'));
console.log(regex.test('yideng'));

/**
 * 11
 */
var yideng = function yideng() {
    yideng = 1; //在函数里面无法修改函数yideng的类型，所以下面输出function
    // var yideng = 1; //-->number
    console.log(typeof yideng);
}
yideng(); //-->function
yideng = 1; //在函数外面可以修改函数类型
console.log(typeof yideng); //-->number
[讲解与拓展]
0. 见注解

/**
 * 12 
 */
var length = 10;
function fn() {
    console.log(this.length);
}
var yideng = {
    length: 5,
    method: function (fn) {
        console.log(this.length); //-->5，this指向yideng
        fn(); //-->10
        arguments[0](); //-->2
    }
};
yideng.method(fn, 1);
[讲解与拓展]
0. 考点：this arguments类数组对象
1. 第一个输出：尽管是 yideng.method(fn)将fn传入，但是因为里面直接执行fn(), 所以this指向全局变量，因此输出10
2. 第二个输出：arguments是一个类数组对象，arguments[0]这里相当于取arguments对象里下标为0的值，也就是传入的第一个参数fn。
所以这里其实是arguments.fn(); 调用者是arguments对象，因此this指向它，它刚好也有length属性，是参数的个数，因此输出2。
3. 拓展：函数的length
function fn(a, b) { }
console.log(fn.length); //2

function fn(a = 1, b) { }
console.log(fn.length); //0

function fn(a, b = 1) { }
console.log(fn.length); //1，a未赋值 ，b赋值了所以被打断了