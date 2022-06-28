// 借助中间函数F实现原型链继承
function create(proto) {
    function F() { }
    F.prototype = proto;
    return new F();
}

// 父类
function Father(name) {
    this.name = name;
}
// 父类自身函数
Father.prototype.sayName = function () {
    console.log('Father name:', this.name);
}

// 子类
function Child(name, fatherName) {
    //执行父类的构造函数
    Father.call(this, fatherName);
    this.name = name;
}
//继承父原型链: 使用一个中间函数实现原型继承, 比之下面那句的好处是不需要再次调用父类的构造函数
Child.prototype = create(Father.prototype);
// Child.prototype = new Father();

// 修改子类原型对象的constructor, 不然会指向父类构造函数, 保证instanceof操作符的正确性
Child.prototype.constructor = Child;

// 子类自身函数
Child.prototype.sayName = function () {
    console.log('Child name:', this.name);
}

// 测试
var father = new Father('FatherName');
var child = new Child('ChildName', 'FatherName');
child.sayName();
father.sayName();
