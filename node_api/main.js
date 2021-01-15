// 调用Hello模块
var Hello = require('./hello'); // 相对路径引入

hello = new Hello();
hello.setName('bambi');
hello.sayHello();



