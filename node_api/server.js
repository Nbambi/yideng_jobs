// var http = require('http');
// var url = require('url');

// function start( router ){
// 	function onRequest( req, res ){
// 		var pathname = url.parse( req.url ).pathname;
// 		router(pathname, res);

// 		// res.writeHead( 200, {'Content-Type': 'text/plain'} );
// 		// res.write('Hello World');
// 		// res.end();
// 	}


// 	http.createServer(onRequest).listen(8888);
// 	console.log('Server has started');
// }

// exports.start = start;




const net = require("net");
// 创建tcp服务
const server = net.createServer();
server.listen(8000);
server.on('listening', () => {
	console.log('监听8000成功');
});
// 一个新的连接建立就会触发该事件
server.on('connection', socket => {
	console.log('有新的连接建立');
	// 接收客户端请求
	socket.on('data', data => { 
		console.log('收到客户端data：', data.toString()); // 底层是流
		// 返回客户端数据
		socket.write('你好, 我是服务端');
	});
	// 关闭此次连接
	server.close();
});
server.on('close', () => {
	console.log('服务端已断开连接');
});
