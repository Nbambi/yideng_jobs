function route( pathname, res ){
	console.log( '接收到来自 ' + pathname + '的请求！' );
	if (pathname == '/') {
		res.writeHead( 200, {'Content-Type': 'text/plain'} );
		res.write('Hello World');
		res.end();
	} else {
		res.writeHead( 404, {'Content-Type': 'text/plain'} );
		res.end('404 Not Found');
	}
}
exports.route = route;