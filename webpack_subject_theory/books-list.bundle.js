// webpackBootstrap webpack启动文件，这是个闭包
// webpack 最终生成的 Template 代码分析



/******/ (function(modules) {
/******/ 	// The module cache 用来缓存 modules
/******/ 	var installedModules = {};
/******/ 
/******/  /** 【!important】下面定义的这个函数是核心函数，return module.exports */
/******/   
/******/ 	// The require function require函数
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache 检测模块缓存
/******/ 		if(installedModules[moduleId]) { //如果有缓存则返回 module.export
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache) 
/******/ 		// 无缓存：声明一个 module 变量存放模块数据，加载模块并缓存 Module
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId, //模块的名字
/******/ 			l: false,
/******/ 			exports: {} //模块导出的值，这里一开始给的值是一个空对象 HERE
/******/ 		};
/******/
/******/ 		// 【!important】这里是特别核心的一段，执行 moduleId，从大闭包的传参可以看到，这里最后会执行 eval 里的东西，eval 里的东西会被转换（见下面）；执行后产生的结果就是 __webpack_exports__ = xxx; 也就是说会把上面我标注 HERE 的地方的 module.exports 替换成模块真正导出的函数体
/******/ 		// Execute the module function 
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		// 上面已经 call 执行模块替换了module.exports = 模块真正导出的函数体，下面这行把 exports 的函数体 return 出去
/******/ 		return module.exports;
/******/ 	}
/******/
/******/  // __webpack_require__.? 下面这些这种格式的都可以忽略，不是核心，是一些辅助的函数
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/  // 加载模块->执行模块的入口key，在这里入口key是 "./src/web/views/books/books-list.entry.js"
/******/ 	// Load entry module and return exports 
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/web/views/books/books-list.entry.js");
/******/ })
/************************************************************************/

/******/ // 下面开始是闭包传的参数：都是一个格式的：moduleId: 函数体
/******/ ({

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

  eval("var g; // This works in non-strict mode\n\ng = function () {\n  return this;\n}();\n\ntry {\n  // This works if eval is allowed (see CSP)\n  g = g || new Function(\"return this\")();\n} catch (e) {\n  // This works if the window reference is available\n  if (typeof window === \"object\") g = window;\n} // g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\n\nmodule.exports = g;\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

  /***/ }),
  
  /***/ "./src/web/assets/css/index.css":
  /*!**************************************!*\
    !*** ./src/web/assets/css/index.css ***!
    \**************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/web/assets/css/index.css?");
  
  /***/ }),
  
  /***/ "./src/web/assets/js/myUnderscore.js":
  /*!*******************************************!*\
    !*** ./src/web/assets/js/myUnderscore.js ***!
    \*******************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  eval("/* WEBPACK VAR INJECTION */(function(global) {/**\n * 学习 underscore、lodash 等书写一个简单的函数式编程工具库\n */\n//工具库外层基本都是用一个闭包包裹起来达到函数级别的作用域隔离，这样函数内的变量不会对外造成污染\n(function () {\n  //对环境进行判断，这部分的写法也值得借鉴\n  var root = typeof self == \"object\" && // self表示window窗口自身，这是浏览器环境下的全局命名空间\n  self.self === self // 如果存在self，判断self是否是自身引用，即window这一对象\n  && self // 如果以上都满足，说明全局对象是window，并返回window作为root，这里self即window\n  || typeof global == \"object\" && // global表示node环境下全局的命名空间\n  global.global === global // 如果存在gloabl，判断global是否是自身引用\n  && global // 如果以上都满足，说明全局对象是global，并返回global作为root\n  || this; // 如果以上都不满足，直接返回this，这里应该处理既不是window这一浏览器环境，也不是global这一node环境的\n  //初始化 _ 对象，暴露出来的对象很简单 _，架构思想：基于可插拔的架构\n\n  var _ = function (obj) {\n    if (obj instanceof _) return obj;\n    if (!(this instanceof _)) return new _(obj);\n    /**\n     * 如果传入的对象是 _ 类型会返回该对象，如果不满足这个条件，那么传入的 obj 就是参数了\n     * 这时会用 wrapped 把参数记录起来\n     * 这行很关键，在 mixin() 的实现里会涉及到\n     */\n\n    this._wrapped = obj;\n  };\n  /**\n   * 节流方法\n   *      1. 每隔一段时间只会执行一次函数\n   *      2. 第一次触发会立即执行\n   *      3. 如果在间隔时间内触发 会在间隔末尾再执行一次\n   * \n   * @param {*} callback 回调函数\n   * @param {*} timer 节流时间/间隔时间\n   */\n\n\n  _.throttle = function (callback, timer) {\n    let isFirst = true; //记录首次触发\n\n    let lastExecDate = null; //记录上一次执行的时间\n\n    let triggerFlag = null; //记录在间隔时间内触发的最新的一次定时器\n\n    if (isFirst) {\n      // 首次触发立即执行\n      callback();\n      lastExecDate = +new Date(); // +转换成时间戳\n\n      isFirst = false;\n    } else {\n      const currentDate = +new Date(); // 判断是否在生效间隔内\n\n      if (currentDate - lastExecDate >= timer) {\n        // 大于间隔 执行回调\n        callback();\n        lastExecDate = +new Date();\n      } else {\n        // 小于间隔 为点击生成一个标识 等到间隔结尾时执行\n        if (triggerFlag) {\n          // 防止在间隔内疯狂被触发 所以只记录最新的一次 然后在结尾触发这一次\n          clearTimeout(triggerFlag);\n        }\n\n        const waitTime = lastExecDate + timer - +new Date(); //到这次间隔结束还需要的时间\n\n        triggerFlag = setTimeout(() => {\n          callback();\n          lastExecDate = +new Date();\n        }, waitTime);\n      }\n    }\n  };\n\n  _.isFunction = function (obj) {\n    return typeof obj == \"function\" || false;\n  }; // 遍历对象上挂载的所有 function 的名称\n\n\n  _.functions = function (obj) {\n    var names = [];\n\n    for (var key in obj) {\n      if (_.isFunction(obj[key])) names.push(key);\n    }\n\n    return names.sort(); //排序并返回\n  };\n\n  _.each = function (arr, callback) {\n    if (Array.isArray(arr)) {\n      for (let i = 0; i < arr.length; i++) {\n        callback(arr[i], i);\n      }\n    }\n\n    return arr;\n  };\n  /**\n   * 遍历 _ 对象上所有 function，整合传入的参数调用 _ 原型链上真正的函数进行执行\n   * \n   * @param {*} obj _ 对象\n   * @returns \n   */\n\n\n  _.mixin = function (obj) {\n    const funcs = _.functions(obj);\n\n    _.each(funcs, function (name) {\n      var func = obj[name]; //取到 fn_name 对应的真正函数\n      //柯里化\n\n      _.prototype[name] = function () {\n        var args = [this._wrapped]; //这个取到的是传入的参数\n\n        Array.prototype.push.apply(args, arguments); //整合参数\n\n        func.apply(_, args); //调用函数 传入参数\n      };\n    });\n\n    return _;\n  };\n\n  _.mixin(_); //执行 mixin 函数，遍历 _ 对象所有 function\n\n\n  root._ = _;\n})(); // ---------------------------------------------------------------------------------------------------------------------------------------\n// 下面非工具库代码\n\n/**\n * 下面两种写法都可以正确的输出数组的元素，第一种没什么疑问，为什么第二种写法也可以正常运行呢？\n * 玄机就在 mixin 函数里\n */\n// _.each([1, 2, 3, 4, 5], item => {\n//     console.log(item);\n// });\n// _([1, 2, 3, 4, 5]).each(item => {\n//     console.log(item);\n// });\n// const logThrottle = _.throttle(\n//     () => { console.log('假装我是个点击事件回调函数') },\n//     1000\n// );\n//测试节流代码；或者写一个按钮 绑个点击事件也行的\n// logThrottle();\n// logThrottle();\n// logThrottle();\n// logThrottle();\n// logThrottle();\n// setTimeout(() => {\n//     logThrottle();\n//     logThrottle();\n//     logThrottle();\n//     logThrottle();\n// }, 1500);\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./src/web/assets/js/myUnderscore.js?");
  
  /***/ }),
  
  /***/ "./src/web/components/banner/banner.css":
  /*!**********************************************!*\
    !*** ./src/web/components/banner/banner.css ***!
    \**********************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/web/components/banner/banner.css?");
  
  /***/ }),
  
  /***/ "./src/web/components/banner/banner.js":
  /*!*********************************************!*\
    !*** ./src/web/components/banner/banner.js ***!
    \*********************************************/
  /*! exports provided: default */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _banner_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./banner.css */ \"./src/web/components/banner/banner.css\");\n/* harmony import */ var _banner_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_banner_css__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction Banner() {\n  console.log('banner init');\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Banner);\n\n//# sourceURL=webpack:///./src/web/components/banner/banner.js?");
  
  /***/ }),
  
  /***/ "./src/web/views/books/books-list.entry.js":
  /*!*************************************************!*\
    !*** ./src/web/views/books/books-list.entry.js ***!
    \*************************************************/
  /*! no exports provided */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_banner_banner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/banner/banner.js */ \"./src/web/components/banner/banner.js\");\n/* harmony import */ var _assets_css_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/css/index.css */ \"./src/web/assets/css/index.css\");\n/* harmony import */ var _assets_css_index_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_css_index_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _assets_js_myUnderscore_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../assets/js/myUnderscore.js */ \"./src/web/assets/js/myUnderscore.js\");\n/* harmony import */ var _assets_js_myUnderscore_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_js_myUnderscore_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\nclass BooksList {\n  constructor() {\n    console.log('BooksList init');\n  }\n\n}\n\nObject(_components_banner_banner_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\nnew BooksList();\n\n//# sourceURL=webpack:///./src/web/views/books/books-list.entry.js?");
  
  /***/ })
  
  /******/ });
   
/**
 * 【分析 webpack 生成的文件】 templete
 * 
 * 下面是这个文件核心的代码简化：
 */
// 一个闭包
(function(modules){
  /**
   *    1. 定义 __webpack_require__ 函数
   *    2. 执行 modules 的入口 moduleId （先从入口 moduleId 开始）
   */

  function __webpack_require__(moduleId){
    /**
     * 1. 寻找是否有模块缓存
     * 2. 无缓存则注册 moduleId 到缓存对象 installedModules 中
     * 3. moduleId 函数表达式执行掉：这里执行逻辑需要缕缕 -> 表达式执行后返回的就是 module.exports，这个将 module 一开始空的 exports={} 覆盖掉
     */
      var module = installedModules[moduleId] = {
        exports: {} //模块导出的值，这里一开始给的值是一个空对象 HERE
      };
      // 【!important】这里是特别核心的一段，执行 moduleId，从大闭包的传参可以看到，这里最后会执行 eval 里的东西，eval 里的东西会被转换（见下面）；执行后产生的结果就是 __webpack_exports__ = xxx; 也就是说会把上面我标注 HERE 的地方的 module.exports 替换成模块真正导出的函数体
      // Execute the module function 
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      // 上面那行替换了module.exports = 模块真正导出的函数体，下面这行把 exports 的函数体 return 出去
      return module.exports;
  }
  return __webpack_require__(modules["./src/web/views/books/books-list.entry.js"]);
})({
  // 下面是闭包的参数，格式为：模块 moduleId: 模块函数体
  "./src/web/views/books/books-list.entry.js": (function(){ eval ( '...' )}),
  "./src/web/components/banner/banner.js":(function(){
    eval(
      // 下面是我们原本写的代码：
      // import './banner.css';
      // function Banner() {
      //     console.log('banner init');
      // }
      // export default Banner;


      // 下面是 webpack 编译成的代码：核心要看的看 /* 的那几行就可以了
      (function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _banner_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/web/components/banner/banner.css"); // * 
        var _banner_css__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_banner_css__WEBPACK_IMPORTED_MODULE_0__);
        function Banner() { // * 
          console.log('banner init'); // * 
          __webpack_exports__["default"] = (Banner) // * 最重要的就是这行，拿到模块 exports 的函数体 Banner，重新赋值 module.exports
        }
      })
    )

    /**
     * 也就是说：webpack 
     *    把 import/require -> __webpack_require__
     *    把 export -> __webpack_exports__
     */
  })
  // ... moduleId: (fn(eval()))
});

/**
 * 总的来说:
 *  就是从入口文件 moduleId 开始执行 __webpack_require__ -> 
 *  执行模块函数体内表达式内容（这里面会依次调用加载（__webpack_require__）所有引入的模块），拿到所有模块真正的 exports 的内容(真正要执行的函数体)
 *  最后就会拿到一堆函数体，闭包执行
 */
    