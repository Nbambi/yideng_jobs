// const fs = require('fs');

/**
 * 文件
 */
// // 文件读取
// // 同步读取， 两个参数 path options
// const readSyncData = fs.readFileSync('data.txt', {encoding: 'utf-8'});
// console.log(readSyncData);
// // 异步读取， 三个参数 path options callback
// const readData = fs.readFile('data.txt', {encoding: 'utf-8'}, (error, data)=>{
//     console.log(data);
// });

// // 文件写入，会直接覆盖掉原文件内容
// fs.writeFileSync('data2.txt', '皮卡皮卡！');
// fs.writeFile('data2.txt', '写入文件！', {encoding: 'utf8'}, err=>{});

// // 追加文件内容
// fs.appendFileSync('data2.txt', 'biubiubiu 追加');
// fs.appendFile('data2.txt', 'lalalala', err=>{});

// // copy文件：(srcfile targetfile) 
// fs.copyFileSync('data.txt', 'datacopy.txt');
// fs.copyFile('data.txt', 'datacopy1.txt',()=>{});

// // 模拟同步拷贝文件
// function copy( srcFile, targetFile ){
//     fs.writeFileSync(targetFile, fs.readFileSync(srcFile));
// }
// copy('data.txt', 'oh.txt');

// // 异步打开/关闭文件 
// fs.open('data.txt', 'r', (err, fd)=>{
//     console.log(fd); // 可以拿到fd文件描述符
//     fs.close(fd, err=>{ // 根据文件描述符关闭文件
//         console.log('close success!');
//     });
// });


// // fs.readFile() 读取文件全部内容
// // fs.read() buffer 读取 配合buffer批量拿出 

// const buf = Buffer.alloc(600); // 创建一块内存大小, 单位byte
// fs.open('data.txt', 'r', (err, fd)=>{
//     // fs.read() 6个参数 (
//         // fd, 
//         // buffer 数据写入的缓存区,
//         // offset buffer中开始写入的位移量 
//         // length 整数，指定要读取的字节数
//         // position 从文件中开始读取的位置
//         // callback( err, bytesRead, buffer)  error, 读取的字节大小, buffer对象(其实就是读取的内容)
//     fs.read(fd, buf, 0, 300, 0, (err, bytesRead, buffer)=>{ // 3个字节一个汉字
//         console.log(bytesRead); // 会打印出实际读取的字节数
//         console.log(buffer.toString());
//     });
// });

// // write buffer
// const buf = Buffer.from('写入文件的内容');
// fs.open('data.txt', 'r+', (err, fd)=>{ // 用读写的方式打开文件
//         // fs.write() 6个参数 (
//             // fd 被写入的文件 
//             // buffer 要写入数据的缓存区
//             // offset buffer中要被写入的位置
//             // length 整数，指定要写入的字节数
//             // position 文件中开始写入的位置
//             // callback( err, bytesRead, buffer)  error, 写入的字节大小, buffer对象(其实就是写入的内容)
//     fs.write(fd, buf, 0, 21, 6, (err, size, buffer)=>{
//         console.log(buffer.toString());
//         fs.close(fd, err=>{
//             console.log('close file success!');
//         });
//     });
// });

// // 文件的删除
// fs.unlinkSync('./a/test.txt');

/**
 * 目录
 */
// // 访问权限，因为可能会抛出异常所以要配合try catch使用
// try {
//     // 参数(path, mode 校验权限项)
//     //      mode可选值 可多个 http://nodejs.cn/api/fs.html#fs_file_access_constants 
//     fs.accessSync('./a/test.txt', fs.constants.R_OK);
//     console.log('可写');
// } catch (error) {
//     console.log('不可');
// }

// fs.access('./a/test.txt', err=>{
//     if(err){
//         console.log('不可访问');
//     } else{
//         console.log('可');
//     }
// });

// // 获取文件目录的信息 stats
// try {
//     let fileStats = fs.statSync('./a/test.txt');
//     console.log(fileStats);
// } catch (error) {
//     console.log('error');
// }

// fs.stat('./a/test.txt', (err, stats)=>{
//     if(err){
//         console.log('error');
//     } else {
//         console.log(stats);
//     }
// });


// // 创建目录，要确认a是存在的，不然会报错
// fs.mkdirSync('./a/c'); 
// fs.mkdir('./a/b', err=>{});

// // 读取目录
// console.log(fs.readdirSync('./a'));

// // 删除目录
// fs.rmdirSync('./a/c');

const fs = require("fs");
const path = require("path");
function getFile(){
    return new Promise((resolve, reject) => {
        const filepath = path.resolve(__dirname, "./node"); // 获取目录绝对路径
        console.log(filepath);
        fs.readdir(filepath, (err, files) => {
            const fileArr = [];
            files.forEach( filename => {
                fileArr.push("/node/" + filename);
            });
            resolve(fileArr);
        });
    });
}

async function getFileArr(){
    const result = await getFile();
    return result;
}

function insertDb(){
    getFileArr().then(res => {
        console.log( res );
    });
}

insertDb();