// 1、阻塞代码
var fs = require('fs'); // 引入fs库 fileStream
var data = fs.readFileSync('data.txt'); // 阻塞读取 同步读取
console.log(data); // 输出16进制ASC码，没有按照字符串处理
console.log(data.toString()); // 转为string输出

// 2、非阻塞代码
var fs = require('fs'); // 引入fs库 fileStream
fs.readFile( 'data.txt', function( err, data){ // 回调函数参数
	if (err) {
		return console.error( err );
	}
	console.log( data.toString() );

} ); // 异步调用: 参数：fileName, callbackFn

console.log( ' END' );

// 会先输出END后输出文件内容：不等待 异步 非阻塞