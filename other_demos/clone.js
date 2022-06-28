// 判断是否为引用类型
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null);
function deepClone(obj, hash = new WeakMap()) {
    // 1. 先从缓存中拿
    if (hash.get(obj)) return hash.get(obj);

    // // 4. 一些特殊引用类型的处理
    // const specialTypeArr = [Date, RegExp, Set, Map, WeakMap, WeakSet];
    // if (specialTypeArr.includes(obj.constructor)) return new obj.constructor(obj);

    // 2. 缓存没有, 创建新的对象, 放入hash防止产生闭环导致的死循环内存栈溢出情况
    let props = Object.getOwnPropertyDescriptors(obj);
    let cloneObj = Object.create(Object.getPrototypeOf(obj), props);
    hash.set(obj, cloneObj);

    // 3. 遍历属性递归处理: 引用类型递归拷贝(这里对function函数也放开了 没有单独处理); 基础类型返回值
    for (let key of Reflect.ownKeys(obj)) {
        cloneObj[key] = isComplexDataType(obj[key]) && (typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key];
    }
    return cloneObj;
}


// let obj = {
//     bigInt: BigInt(12312),
//     set: new Set([2]),
//     map: new Map([['a', 22], ['b', 33]]),
//     num: 0,
//     str: '',
//     boolean: true,
//     unf: undefined,
//     nul: null,
//     obj: {
//         name: '我是一个对象',
//         id: 1
//     },
//     arr: [0, 1, 2],
//     func: function () {
//         console.log('我是一个函数')
//     },
//     date: new Date(0),
//     reg: new RegExp('/我是一个正则/ig'),
//     [Symbol('1')]: 1,
// };

// Object.defineProperty(obj, 'innumerable', {
//     enumerable: false,
//     value: '不可枚举属性'
// });

// obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
// obj.loop = obj; //构建一个循环案例

// let cloneObj = deepClone(obj);
// console.log('obj', obj);
// console.log('cloneObj', cloneObj);


let target = {
    bigInt: BigInt(12312),
    num: 0,
    str: '',
    boolean: true,
    field1: 1,
    nul: null,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8],
    func: function () {
        console.log('我是一个函数')
    },
    [Symbol('1')]: 1,
    date: new Date(0),
    reg: new RegExp('/我是一个正则/ig'),
    set: new Set([2]),
    map: new Map([['a', 22], ['b', 33]]),

};
// 使用api创建不可枚举的属性
Object.defineProperty(target, 'innumerable', {
    enumerable: false,
    value: '不可枚举属性'
});
// 构造一个自引用, 造成循环
target = Object.create(target, Object.getOwnPropertyDescriptors(target));
target.loop = target;

console.log('target', target);
console.log('cloneTarget', deepClone(target));