const fs = require("fs");
const path = require('path');
const readLine = require('readline'); //逐行读取模块

const filepath = path.resolve(__dirname, 'log.txt');
const readStream = fs.createReadStream(filepath);
let count = 0;
// 创建readline对象
readLineObj = readLine.createInterface({
    input: readStream // 输入
});
readLineObj.on('line', data => {
    console.log('line: ', data);
    if(data.indexOf('日志') !== -1){
        count++;
    }
});
readLineObj.on('close', () => {
    console.log('读取完成：', count);
});