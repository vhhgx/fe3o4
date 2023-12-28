# 对象、原型和继承

## 对象的创建和属性

对象是一组属性的无序集合，可以用`工厂模式`和`构造函数模式`这两种设计模式创建对象，或者直接通过对象字面量进行创建

```js
// 对象字面量
let person = {
  name: "vhhg",
  age: 29,
  job: "Software Engineer",
  sayName() {
    console.log(this.name)
  }
}
```

### 工厂模式

```js
function createPerson(name, age, job) {
  // 这里采用了new关键字来创建了新对象实例
  // 然后再为其添加属性和方法
  let obj = new Object()
  obj.name = name
  obj.age = age
  obj.job = job
  obj.sayName = function() {
    console.log(this.name)
  }
  return obj
}

let p1 = createPerson("vhhg", 18, "engineer")
```

### 构造函数模式

与工程模式类似，但没有显式的创建对象，属性和方法直接赋值给了函数自身的this指针，便不需要进行return

```js
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    console.log(this.name)
  }
}

let p1 = new Person("vh", 18, "engineer")
let p2 = new Person("hg", 24, "car engineer")
```

构造函数是函数的一种，唯一的区别在于调用方式。任何使用new关键字调用的函数都可以被叫做构造函数，不使用则为普通函数。


**这里有问题** 当构造函数不使用new关键字，即没有明确指向this时，会将属性和方法添加到全局对象，在node中为Global，在浏览器中为window

TODO 这里的要添加一个this的链接

TODO 这里需要引入一个new关键字相关内容。或者说new关键字要跳到这里，下面的原型链要调到这里


## 对象属性

在对象中，有一些开发者不能直接访问的内部特性，用`[[]]`括起来进行区分，分为数据属性和访问器属性

### 数据属性

**数据属性** 有以下四个特性


| 属性名             | 含义                                                     |  默认值   |
| ------------------ | -------------------------------------------------------- | :-------: |
| `[[Configurable]]` | 是否可以通过delete删除并重新定义、是否可以改为访问器属性 |   true    |
| `[[Enumerable]]`   | 是否可以通过for-in循环返回                               |   true    |
| `[[Writable]]`     | 值是否可以修改                                           |   true    |
| `[[Value]]`        | 属性实际的值、保存数据值的位置                           | undefined |

如果需要修改属性的默认特性，需要使用 [Object.defineProperty() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 方法，结合实例

```js
let person = { name: "vhhg" }
```

上面代码创建了一个person对象并添加了名为name的属性。所以name这个属性的`[[Value]]`特性将被设置为`vhhg`。之后对该值的任何修改都会保存到这个位置

<!-- 如果要给person对象更改特性并将其设为不可修改， -->

```js
Object.defineProperty(person, "name", {
  wirtable: false,
  value: "elyhg"
})
```

修改了person对象的name属性值，并将其设置为只读。如果一个属性被定义为不可配置后，就无法便会可配置。尝试修改会抛出错误


### 访问器属性

**访问器属性** 不可直接定义，必须使用`Object.defineProperty()`方法

| 属性名             | 含义                             |  默认值   |
| ------------------ | -------------------------------- | :-------: |
| `[[Configurable]]` | 是否可以通过delete删除并重新定义 |   true    |
| `[[Enumerable]]`   | 是否可以通过for-in进行循环       |   true    |
| `[[Get]]`          | 获取函数，读取数据时调用         | undefined |
| `[[Set]]`          | 设置函数，写入属性时调用         | undefined |

结合实例

```js
let book = { _year: 2017, edition: 1 } 
Object.defineProperty(book, "year", { 
  get() { 
    return this._year 
  }, 
  set(newValue) { 
    if (newValue > 2017) { 
      this._year = newValue 
      this.edition += newValue - 2017 
    } 
  } 
}) 

book.year = 2018 // 将year赋值为2018
console.log(book.edition) // 输出2
```

get函数和set函数并不一定都要定义。只定义get函数意味着属性是只读的。在非严格模式下，执行修改会被忽略，严格模式下则会**抛出错误**。类似的，只有一个`set`函数的属性是不能读取的。在非严格模式下会返回`undefined`，严格模式下会**抛出错误**

### 属性的方法

如果要定义多个属性，则可使用 [Object.defineProperties() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) 方法，与defineProperty()方法类似

```js
let book = {} 
Object.defineProperties(book, { 
  _year: { 
    value: 2017 
  }, 
  edition: { 
    value: 1 
  }, 
  year: { 
    get() { 
      return this._year 
    },
    set(newValue) { 
      if (newValue > 2017) { 
        this._year = newValue 
        this.edition += newValue - 2017 
      } 
    } 
  }
})
```

读取属性的特性则需要 [Object.getOwnPropertyDescriptor() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 方法。以上面的book对象为例

```js
let _descriptor = Object.getOwnPropertyDescriptor(book, "_year")
console.log(_descriptor.value) // 2017
console.log(_descriptor.configurable) // false
console.log(typeof _descriptor.get) // undefined

let descriptor = Object.getOwnPropertyDescriptor(book, "year")
console.log(descriptor.value) // undefined，因为没有进行赋值
console.log(descriptor.enumerable) // false
console.log(typeof descriptor.get) // function
```

ES2017 新增了 [Object.getOwnPropertyDescriptors() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors) 方法，参数为对象。该方法实际上就是在每个自有属性上调用`Object.getOwnPropertyDescriptor()`方法并在新对象中返回他们


## 构造函数

一种特殊的函数，主要用于创建和初始化一个对象。在构造函数内部，可以使用this关键字来添加属性和方法，这些方法会添加到所有实例上

使用`new`关键字调用生成实例。实例会有一个指针对象`__proto__`指向构造函数的原型对象，具体详见 [原型和原型链]()


### 执行new函数发生了什么

- 开辟新内存
- 让构造函数的实例可以访问该构造函数原型在原型链上的属性，即将该实例的`__proto__`指向构造函数的原型对象
- 更改内存的this指向，把构造函数内部的this赋值给新对象
- 执行构造函数代码
- 如果构造函数返回一个非空对象，则实例为该对象，否则为刚创建的对象

```js
function _new (ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw "构造函数必须是函数"
  }

  let obj = new Object()
  // 把构造函数的原型链传给新对象
  obj.__proto__ = Object.create(ctor.prototype)
  let res = ctro.apply(obj, ...args) // 这个是什么
  
  let type = ['object', 'function'].includes(typeof res)
  return res !== null && type ? res : obj
}

function Person (name, age) {
	this.name = name
	this.age = age
}

let p = _new(Person, ['vhhg', 24])
```

## 原型与原型链

### 原型

在js中一切都是Object，JS会为每个Object创建一个`prototype`属性，即为原型对象。对象通过`prototype`属性（指针）指向自身的原型对象。同时原型对象也有一个`constructor`指针指回Object自身，这就是原型

看下面的代码

```js
let Person = function() {}
// 查看原型属性，输出 {constructor: ƒ}
console.log(Person.prototype)
// 查看原型的 constructor 属性，输出 ƒ () {}
console.log(Person.prototype.constructor)
console.log(Person.prototype.constructor === Person) // true
```
使用原型对象的好处就是在它上面定义的属性和方法可以被对象实例共享。原来在构造函数中直接赋给对象实例的值，可以直接赋值给他们的原型。


### 原型链

除了`prototype`和`constructor`属性对象和原型对象循环引用之外。还有一个`__proto__`属性，由对象的实例指向对象的原型对象。以构造函数Person为例

```js
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    console.log(this.name)
  }
}

// 创建实例
let person1 = new Person()
let person2 = new Person()

// 查看实例的__proto__ 输出 {constructor: ƒ}
console.log(person1.__proto__)
console.log(person1.__proto__ === Person.prototype) // true
```

原型链就是用每个对象的`__proto__`指针将各个对象连接起来，最后直到`Object.prototype`。该原型对象的原型链指针指向null。在对某个属性或方法进行查找的时候，就会顺着`__proto__`指针向上逐级查找。找到则返回该属性或方法，找不到则返回`undefined`。如下图

![](/prototype.png)


```js
// 由上图可得，以下全为true
console.log(Person.prototype.__proto__ === Obejct.prototype)
console.log(Person.prototype.__proto__.constructor === Obejct)
console.log(Person.prototype.__proto__.__proto__ === null)

console.log(person1.__proto__ === Person.prototype)
console.log(person1.__proto__.constructor === Person)

console.log(person1.__proto__ === person2.__proto__)
```

### 扩展方法

[Object.prototype.isPrototypeOf() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)

传入对象作为参数，检查一个对象是否存在于另一个对象的原型链上

```js
// 返回 true 说明`person1`为`Person`的实例对象
console.log(Person.prototype.isPrototypeOf(person1))
```


[Object.getPrototypeOf() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)

返回指定对象的原型

```js
console.log(Object.getPrototypeOf(person1) === Person.prototype) // true
```

[Object.prototype.hasOwnProperty() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)


传入某个属性作为参数，用于确定该属性是在实例上还是在原型上。来自实例返回true


## 类与继承


### 类

使用`class`进行声明，类名首字母通常大写。每个类都有一个constructor方法，用于在创建新实例时初始化对象，使用new关键字创建新实例时，constructor方法会被自动调用

可以使用static关键字定义类的静态方法，静态方法只能通过类本身来调用，而无法通过实例，看下面的代码

```js
class Person {
  constructor(name) {
    this.name = name
  }

  greet() {
    console.log(`Hello, my name is ${this.name}!`)
  }

  static species() {
    return 'Homo sapiens'
  }
}

let p1 = new Person('coder')

console.log(p1) // Person {name: 'coder'}
console.log(Person.species()) // Homo sapiens
console.log(p1.species()) // p1.species is not a function
console.log(p1.greet()) // Hello, my name is coder!
```

类也支持getter和setter方法，同时可以在属性名或方法前加上·#·将其标记为私有，只能在类的内部访问


```js
class Person {
  #id

  constructor(name, id) {
    this.name = name
    this.#id = id
  }

  getId() {
    return this.#id
  }
}
```

需要注意的是类的声明不会提升，且类的所有代码都会在严格模式下执行

### 类的继承

可以使用·extends·关键字来继承另一个类，子类会继承父类的所有方法，在子类中使用·super·关键字，子类的构造函数可以放访问和调用父类的构造函数

```js
class Employee extends Person {
  constructor(name, jobTitle) {
    super(name) // 调用父类的 constructor
    this.jobTitle = jobTitle
  }

  describe() {
    console.log(`${this.name} is a ${this.jobTitle}`)
  }
}

let e1 = new Employee('cc', 'coder')
console.log(Employee.species()) // Homo sapiens
console.log(e1) // Employee {name: 'cc', jobTitle: 'coder'}
console.log(e1.describe()) // cc is a coder
```

## 继承

继承是一种面向对象的开发方法，使子类拥有父类的各种方法和属性。这种方式可以更好地复用之前的代码，提升效率

### 原型链继承

比较常见的继承方法，缺点在于该方式的多个实例使用的是同一个原型对象，共享其内存空间。需要把子构造函数的prototype指向父构造函数

```js
function Car() {
  this.wheels = 4
  this.nop = [1, 2, 4]
}

function Suv() { 
  this.petrol = "cai" 
}

Suv.prototype = new Car()

let s1 = new Suv()
let s2 = new Suv()

//分别输出 [1,2,4] 和 [1,2,4] 
console.log(s1.nop, s2.nop)
s1.nop.push(8)

//分别输出 [1,2,4,8] 和 [1,2,4,8] 
console.log(s1.nop, s2.nop)
```

### 构造函数继承

需要借助call()，这种方法只能继承父类的实例属性和方法，不能继承原型属性或方法

```js
function Parent() { 
  this.name = "parent"
}

Parent.prototype.getName = function() {
  return this.name
}

function Child() {
  Parent.call(this)
  this.type = 'child'
}

let child = new Child()
console.log(child) // {name: 'parent', type: 'child'}
console.log(child.getName()) // Uncaught TypeError: child.getName is not a function
```

### 组合继承

结合了原型链继承与构造函数继承

```js
function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}

Parent.prototype.getName = function() {
  return this.name
}

function Child() {
  // 第二次调用Parent
  Parent.call(this)
  this.type = 'child'
}
// 挂载，第一次调用Parent
Child.prototype = new Parent() 
// 再手动挂上构造器，指向自己的构造函数
Child.prototype.constructor = Child

let s3 = new Child()
let s4 = new Child()

s3.play.push(4)
// Array(4) [ 1, 2, 3, 4 ] Array(3) [ 1, 2, 3 ]
console.log(s3.play, s4.play)
```


### 原型式继承

通过使用Object.create()方法，以一个现有对象作为原型，创建一个新对象


```js
let parent = {
  name: 'parent',
  friends: ['p1', 'p2', 'p3'],
  getName: function() {
    return this.name
  }
}

// 此时person的原型对象就是parent
let person = Object.create(parent)


// 对person进行修改，并不会影响到parent对象
person.name = "tom"
person.friends.push("jerry")
```

由于parent中friends为引用类型，共享内存空间，所以push操作也会对parent数组进行修改

### 寄生式继承


```js
let parent = {
  name: 'parent',
  friends: ['p1', 'p2', 'p3'],
  getName: function() {
    return this.name
  }
}

// 以原型式继承的方式 创建clone新对象
function clone (original) {
  let clone = Object.create(original)
  clone.getFriends = function() {
    return this.friends
  }
  return clone
}

let person = clone(parent)
/* 寄生继承的person
Object {
  getFriends: function getFriends(),
  <prototype>: {
    friends: ['p1', 'p2', 'p3'], 
    getName: function getName(), 
    name: 'parent' 
  }
}
*/
console.log(person)
```

### 寄生式组合继承


在前面几种继承方式的优缺点基础上进行改造，也是所有继承方式里相对最优的继承方式

```js
function Parent() {
  this.name = "parent"
  this.play = ['p1', 'p2', 'p3']
}

Parent.prototype.getName = function() {
  return this.name
}
/*
  { name: "Parent", <prototype>: { getName: getName() } }
*/

function clone (parent, child) {
  // 这里使用create可以减少一次构造的过程
  child.prototype = Object.create(parent.prototype)
  child.prototype.constructor = child
}

function Child () {
  Parent.call(this)
  this.friends = "child"
}

clone(Parent, Child)

Child.prototype.getFriends = function() {
  return this.friends
}

let person = new Child()
```

TODO extends 继承关键字的实现逻辑