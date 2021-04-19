/**
 * Node自带工具查看内存占用空间、手动 gc 等实践（map 与 weakmap）
 * 
 *  1. process.memoryUsage()
 *      返回包含 Node 进程内存占用信息的对象, 对象包含4个字段, 单位是字节, 见下: (PS: 判断内存泄露以 heapUsed 字段为准)
 *          - rss(resident set size): 所有内存占用
 *          - heapTop: 堆占用的内存，包括用到的和没用到的
 *          - heapUsed: 用到的堆内存
 *          - external: V8引擎内部对象占用的内存
 * 
 * 2. global.gc() 手动 gc
 * 
 * 3. 执行看效果, 使用命令: node --expose-gc ./node-meme.js
 *  
 */

global.gc(); //初始化 清除一下
console.log('init -->\n', process.memoryUsage(), '\n'); //输出 NodeJs 使用情况

// map
let map = new Map();
let key = new Array(5 * 1024 * 1024);
map.set(key, 1);
global.gc();
console.log('map gc -->\n', process.memoryUsage(), '\n');

key = null;
global.gc();
console.log('key=null, map gc -->\n', process.memoryUsage(), '\n');

map.delete(key);
key = null;
global.gc();
console.log('delete key, key=null, map gc -->\n', process.memoryUsage(), '\n');

// weakmap
let weakMap = new WeakMap();
let weakKey = new Array(5 * 1024 * 1024);
weakMap.set(weakKey, 1);
global.gc();
console.log('weakmap gc -->\n', process.memoryUsage(), '\n');