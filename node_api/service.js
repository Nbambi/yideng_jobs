var http = require( 'http' ); // 通过require加载http模块赋值给http对象

// 创建http服务
http.createServer( function( req, res ){ // 参数,固定格式：接收浏览器请求、返回给浏览器的响应
	// 定义HTTP头
	res.writeHead( 200, {'Content-Type': 'text/plan'} ); // status, 头信息(content-type必填)

	// 发送响应数据
	res.end( 'Hello world!\n' ); // res-data
}).listen( 8000 );  // 定义服务端口号

// 服务运行后输出信息，验证是否成功运行
console.log( 'server is running' );