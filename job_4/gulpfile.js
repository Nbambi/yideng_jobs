const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const rollup = require('gulp-rollup');
const replace = require('@rollup/plugin-replace');

const entry = './src/server/**/*.js';

/**
 * `buildDev` 函数并未被导出（export），因此被认为是私有任务（private task）。它仍然可以被用在 `series()` 组合中。
 * 如果将该函数导出，则是公有任务，可以被 gulp 直接调用。也仍然可以被用在 `series()` 组合中。
 * 
 * gulp 的任务都是异步执行的
 */
// 开发环境打包
function buildDev() {
    /**
     * src() 接受 glob 参数（Golb详解：https://www.gulpjs.com.cn/docs/getting-started/explaining-globs/），并从文件系统中读取文件然后生成一个 Node 流（stream）。
     * 它将所有匹配的文件读取到内存中并通过流（stream）进行处理。
     * 流（stream）所提供的主要的 API 是 .pipe() 方法，用于连接转换流（Transform streams）或可写流（Writable streams）。
     */
    // return gulp.src(entry) //src指定入口文件
    return watch(entry, { ignoreInitial: false })
        .pipe(babel({
            babelrc: false, //不使用.babelrc文件配置，这个文件是给webpack打包前端代码用的
            plugins: ["@babel/plugin-transform-modules-commonjs"] //使用这个插件处理
        }))
        .pipe(gulp.dest('dist')) //dest指定输出目录
}

// 线上环境打包
function buildProd() {
    return gulp.src(entry) //src指定入口文件
        .pipe(babel({
            babelrc: false, //不使用.babelrc文件配置，这个文件是给webpack打包前端代码用的
            plugins: ["@babel/plugin-transform-modules-commonjs"] //使用这个插件处理
        }))
        .pipe(gulp.dest('dist')) //dest指定输出目录
}

// 清洗 config 目录（这里只是因为在config下的文件里写了废代码所以清洗这个，就是举个例子）
function cleanConfig() {
    return gulp.src(entry)
        .pipe(
            rollup({
                input: path.join(__dirname, './src/server/config/config.js'), //要清洗的文件
                output: { format: "cjs" },
                plugins: [
                    replace({
                        //将key替换为value：在打包config文件时就只会匹配上线环境的配置对象了
                        'process.env.NODE_ENV': JSON.stringify('production'),
                    })
                ]
            })
        )
        .pipe(gulp.dest('dist'));
}

// 区分环境进行打包
let build = null;
if (process.env.NODE_ENV === 'development') {
    build = gulp.series(buildDev);
}
if (process.env.NODE_ENV === 'production') {
    build = gulp.series(buildProd, cleanConfig);
}

/**
 * Gulp 提供了两个强大的组合方法： series() 和 parallel()，允许将多个独立的任务组合为一个更大的操作。
 * 这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。series() 和 parallel() 可以互相嵌套至任意深度。
 * 这两个方法和组合使用 并且可嵌套至任意深度
 * 
 * 1. 如果需要让任务（task）按顺序执行，请使用 series() 方法。
 * 2. 对于希望以最大并发来运行的任务（tasks），可以使用 parallel() 方法将它们组合起来。
 * 
 * 当 series() 或 parallel() 被调用时，任务（tasks）被立即组合在一起。
 * 这就允许在组合中进行改变，而不需要在单个任务（task）中进行条件判断。
 */

// exports.default = gulp.series(buildDev); //导出的函数会被注册到 gulp 的任务系统中
gulp.task('default', build); //亦可以用task函数注册任务