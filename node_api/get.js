var http = require('http');
var url = require('url');
var util = require('util');

http.createServer( function( req, res ){
	// 获取 Get 请求内容
	res.writeHead(200, {'Content-Type': 'text/plain', 'charset': 'utf8'});
	res.write( util.inspect(url.parse( req.url, true )) ); // ？
	res.write("\n");

	// 获取 url 参数
	var params = url.parse(req.url, true).query;
	res.write('网站名称', params.name);
	res.write("\n");
	res.write('网站URL', params.url);

	res.end();

}).listen(8888);
console.log('server start');