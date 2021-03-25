//app.js：模拟 NodeJS 程序进程

var http = require('http');
http.createServer(function(req, res){
    res.writeHead(200);
    res.end('Hello World');
}).listen(8000);