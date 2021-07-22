/**
 * 深拷贝
 * @param {*} obj 
 * @returns 
 */


// 工具函数: 判断对象是否为引用类型, 返回true表示是
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)

const deepClone = function (obj, hash = new WeakMap()) {
    // 1. 先从map缓存中取
    if (hash.has(obj)) return hash.get(obj);

    // 2. 判断是否是以下类型中的其一(下面这些类型都有constructor), 是则调用其构造函数将对象传入 -> 构造出一个全新的一样内容的对象
    let type = [Date, RegExp, Map, Set, WeakMap, WeakSet];
    if (type.includes(obj.constructor)) return new obj.constructor(obj); //传入obj作为构造函数的参数, 作为新对象的内容参数

    // 3. 非上面那些引用类型, 继续处理: 取出对象所有属性的特性对象, 根据原型对象和特性调用 Object.create() 创建拷贝后的对象
    let allDesc = Object.getOwnPropertyDescriptors(obj);  //遍历传入参数(对象)所有自身键(属性)的特性(描述符)
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc); //继承原型
    // 存入WeakMap, 处理循环的关键: 这样后面如果成环了, 会在WeakMap中找到第一次放入的obj, 提前返回第一次放入WeakMap的cloneObj
    hash.set(obj, cloneObj);

    // 4. 遍历原对象, 进行类型判断 -> 引用(递归拷贝); 基本类型(返回值)
    for (let key of Reflect.ownKeys(obj)) { //Reflect.ownKeys(obj)返回所有属性包括不可枚举的属性和符号类型
        // 如果值是引用类型(非函数)则递归调用deepClone; 否则就是基本数据类型, 则返回值
        cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key];
    }
    return cloneObj;
};


let obj = {
    bigInt: BigInt(12312),
    set: new Set([2]),
    map: new Map([['a', 22], ['b', 33]]),
    num: 0,
    str: '',
    boolean: true,
    unf: undefined,
    nul: null,
    obj: {
        name: '我是一个对象',
        id: 1
    },
    arr: [0, 1, 2],
    func: function () {
        console.log('我是一个函数')
    },
    date: new Date(0),
    reg: new RegExp('/我是一个正则/ig'),
    [Symbol('1')]: 1,
};

Object.defineProperty(obj, 'innumerable', {
    enumerable: false,
    value: '不可枚举属性'
});

obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj; //构建一个循环案例

let cloneObj = deepClone(obj);
console.log('obj', obj);
console.log('cloneObj', cloneObj);

for (let key of Object.keys(cloneObj)) {
    if (typeof cloneObj[key] === 'object' || typeof cloneObj[key] === 'function') {
        console.log(`${key}相同吗？ `, cloneObj[key] === obj[key])
    }
}
