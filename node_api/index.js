var server = require('./server');
var router = require('./router');
server.start( router.route ); // 把函数当作参数传过去
