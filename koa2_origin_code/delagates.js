/**
 * koa context 属性委托/代理 原理分析
 * 
 *  1. Koa 核心中的 context 对象，许多读写操作都是基于它进行，通过该对象可以获取请求、响应的信息，还可以抛出异常等等，如何实现的呢？答案就是属性委托/代理。
 *  2. koa lib 下的 context.js 中使用 delagates 库将 context.request & context.response 上的属性都委托到了 context 对象上
 *  3. delagates 库中实现的方式比较旧，推荐使用 Object.defineProperty( obj, attr, {...} ) 或者 set、get 操作符来实现相同的功能
 * 
 *  参考文章：https://mp.weixin.qq.com/s/Lch5ifOLjMKpFrUspNEdmw  
 */

// 下面使用 Object.defineProperty() 方式实现库里相同的功能

