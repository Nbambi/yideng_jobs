
'use strict';

/**
 * Module dependencies.
 */

const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose'); // 实现 Koa 中间件机制，github -> https://github.com/koajs/compose/blob/master/index.js
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');
const { HttpError } = require('http-errors');

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

module.exports = class Application extends Emitter {
  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  /**
    *
    * @param {object} [options] Application options
    * @param {string} [options.env='development'] Environment
    * @param {string[]} [options.keys] Signed cookie keys
    * @param {boolean} [options.proxy] Trust proxy headers
    * @param {number} [options.subdomainOffset] Subdomain offset
    * @param {boolean} [options.proxyIpHeader] proxy ip header, default to X-Forwarded-For
    * @param {boolean} [options.maxIpsCount] max ips read from proxy ip header, default to 0 (means infinity)
    *
    */

  constructor(options) {
    super();
    options = options || {};
    this.proxy = options.proxy || false;
    this.subdomainOffset = options.subdomainOffset || 2;
    this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
    this.maxIpsCount = options.maxIpsCount || 0;
    this.env = options.env || process.env.NODE_ENV || 'development';
    if (options.keys) this.keys = options.keys;
    this.middleware = []; //中间件列表
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }

  /**
   * 创建 Http 服务
   *  服务开启的入口 可以从这里看作为整体流程梳理的开头
   * 
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

  listen(...args) {
    debug('listen');
    // 基于 Node 原生的 http 模块实现 Web 服务器
    const server = http.createServer(this.callback()); // 传参函数：会在 request 事件触发时被调用，也就是收到 http 请求时被调用
    return server.listen(...args);
  }

  /**
   * Return JSON representation.
   * We only bother showing settings.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env'
    ]);
  }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    return this.toJSON();
  }

  /**
   * 注册中间件
   * 
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    // 中间件类型校验 中间件必须是函数 否则抛出错误
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    // 向前兼容中间件函数， Koa1 中间件函数是 Generaor 函数
    if (isGeneratorFunction(fn)) { // 判断函数是否为 Generaor 函数
      // 弃用代码提示工具
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn); // 使用 co 函数对生成器函数进行转换
    }
    debug('use %s', fn._name || fn.name || '-');
    // 将中间件添加到中间件列表
    this.middleware.push(fn);
    // 返回当前实例 供链式调用
    return this;
  }

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  callback() {
    // 组合中间件
    const fn = compose(this.middleware);

    // 对 error 事件上监听的函数计数，如果一个都没有则使用默认的 error 事件监听函数
    if (!this.listenerCount('error')) this.on('error', this.onerror);

    // 每当有 HTTP 请求到来时，都会通过 createContext 方法为该请求创建一个全新的 ctx 对象，然后将控制权交给当前实例上的 handleRequest 方法
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      // 返回当前实例上的 handleRequest 方法，这个方法在每次有 http 请求发生时就会被调用
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    // 错误处理函数 & context.js onerror(){}
    const onerror = err => ctx.onerror(err);
    // 响应回调函数 respond
    const handleResponse = () => respond(ctx);
    // 执行清理操作
    onFinished(res, onerror);
    // 中间件处理 -> 调用 respond 函数响应客户端 -> 错误处理函数兜底进行错误处理
    // 中间件处理会返回 Promise，如果 Pormise 状态为 Rejected，则会进入 catch 语句块中触发错误处理函数
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  /**
   * Initialize a new context.
   *
   * @api private
   */

  createContext(req, res) {
    // 以当前对象的 context/request/response 为原型创建对象
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    // 进行相互赋值
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    // state 是 Koa 中推荐保存请求状态（如用户 id）的地方
    context.state = {}; 
    return context;
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
};

/**
 * Response helper.
 * 
 * respond 会拿到 ctx 对象上的 body 属性，并根据 body 的类型，以及请求方法等参数确定响应形式，然后通过原生的 res 对象响应客户端
 */

function respond(ctx) {
  // allow bypassing koa
  // 允许自定义响应函数
  if (false === ctx.respond) return;

  if (!ctx.writable) return;

  // 从 ctx 中拿到 body 和 res
  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' === ctx.method) {
    if (!res.headersSent && !ctx.response.has('Content-Length')) {
      const { length } = ctx.response;
      if (Number.isInteger(length)) ctx.length = length;
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}

/**
 * Make HttpError available to consumers of the library so that consumers don't
 * have a direct dependency upon `http-errors`
 */
module.exports.HttpError = HttpError;
