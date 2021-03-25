//manager.js：拉起子进程
//主进程和子进程都会执行这里，判断自己是主进程还是子进程

var cluster = require('cluster');
var numCPUs = require('os').cpus().length; //CPU 核数

// 判断自己是不是主进程
if(cluster.isMaster){
    console.log(numCPUs);
    
    // 主进程衍生工作进程（子进程），有几核就fork几个子进程
    // 子进程和主进程共享一个端口
    for(var i=0; i<numCPUs; i++){
        var worker = cluster.fork(); 
    }
} else {
    // 子进程去干活
    require('./app.js');
}