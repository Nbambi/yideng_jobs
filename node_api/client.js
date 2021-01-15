const net = require("net");

// 连接到服务端
const netSocket = net.connect('8000', () => {});
netSocket.on('error', err => {
    console.log('连接失败，', err);
});
// 连接成功触发该事件
netSocket.on('connect', () => {
    console.log('客户端与服务端连接已经建立');
    console.log(netSocket.localAddress);
    console.log(netSocket.localPort);
    netSocket.write('hello, 我是客户端');
    // 接收服务端数据
    netSocket.on('data', data => {
        console.log('客户端收到的服务端的数据：', data.toString());
        netSocket.end();
    });
});
// 连接关闭触发
netSocket.on('end', () => {
    console.log('客户端关闭连接');
});