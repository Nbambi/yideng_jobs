// 1、引入event模块并创建eventsEmitter对象
var events = require('events');
var eventEmitter = new events.EventEmitter();

// 2、绑定事件处理函数
var connctHandler = function conncted(){
	console.log('connected 被调用！');
}
eventEmitter.on('connection', connctHandler); // 完成事件绑定，param(事件处理名称，事件处理聚句柄)

// 3、触发事件
eventEmitter.emit('connection');

console.log( '程序执行完毕' );

