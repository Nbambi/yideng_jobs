import { list } from './js/list'; // const list = require('./list'); 
import './assets/index.less';
// import img from './assets/yibo.jpg';
import "@babel/polyfill";

// list();
// console.log(img);

alert('this is list2');

// HMR 模块热更新
if (module.hot) {
    module.hot.accept('./js/list.js', () => {
        console.log('更新list文件模块');
        list();
    });
    // module.hot.decline('./js/list.js'); //加上这行：关闭这个热更新模块的部分，再修改会引起页面整体刷新
}

const arr_map_test = ['apple', 'orange', 'banana'];
arr_map_test.map((item, index) => {
    console.log(item);
});

import { fn1, fn2 } from './common/util';
fn1();

import { chunk } from 'lodash-es';
console.log(chunk([1, 2, 3], 2));


import $ from 'jquery'; //不优化第三方库时需要在要使用的文件中这样引入

// import(/*webpackChunkName: 'jquery'*/ 'jquery').then(({ default: $ }) => {
//     console.log('第三方库打包优化方法三 -> 动态加载');
// });