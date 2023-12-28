# 高级对象特性


- this 关键字
- 对象方法（Object.create, Object.assign 等）
- 属性描述符和对象属性的设置（Object.defineProperty）
- Proxy 和 Reflect


深浅拷贝的核心区别在于它们如何处理对象和数组内部的引用类型。浅拷贝只复制对象的第一层属性，如果属性是引用类型，则复制其引用。深拷贝则会递归复制所有层级的属性，为所有引用类型创建新的实例。这个主题通常与对象的创建、操作和属性访问密切相关，因此归类到“高级对象特性”是最合适的。


## this关键字

在函数执行时被创建的特殊变量，指向函数执行时的上下文对象。有以下几种类型

- 全局上下文：指向全局对象，在浏览器中为window，在nodejs中为global
- 函数内部：取决于该函数如何被调用
- 方法内部：指向调用该方法的对象
- 构造函数：新创建的对象实例

简单来说就是谁调用了函数就指向谁


```js
function showContext() {
  console.log(this) // 全局上下文
}

const obj = {
  method: function() {
    showContext() // 全局上下文
    console.log(this) // obj
  }
}

// 新创建的 showContext 实例 sc
const sc = new showContext() 
obj.method()
```

## 改变this指向


通过call、apply和bind显式的修改。箭头函数自身没有this，继承自父执行上下文的this

### call & apply

将第一个参数指向调用的对象，唯一区别在于apply接受一个数组

```js
function greet(greeting) {
  console.log(`${greeting}, I am ${this.name}`)
}

const person = { name: 'Alice' }
greet.call(person, 'Hello')   // 输出: Hello, I am Alice
greet.apply(person, ['Hello']) // 输出: Hello, I am Alice
```

### bind

返回一个修改过this的函数

```js
function greet() {
  console.log(`Hello, I am ${this.name}`)
}

const person = { name: 'Alice' }
const boundGreet = greet.bind(person)
boundGreet() // 输出: Hello, I am Alice
```


## proxy和reflect



## 浅拷贝 & 深拷贝  


浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。但深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象

### 浅拷贝

浅拷贝比深拷贝要快得多，因为它不需要递归复制对象的每个级别。在对性能有要求且不需要深层复制的情况下，选择浅拷贝是更高效的。


```js
let obj = { name: "vhhg", age: 25, other: {a: 1, b: 2, c: 3}}
console.log(obj.other.a) // 1
let obj2 = Object.assign({}, obj)

obj.other.a = 4
obj.age = 26
console.log(obj.age, obj.other.a) // 26,4
console.log(obj2.age, obj2.other.a) // 25,4
```

### 常用的浅拷贝方法

- 对象方法：`Object.assign()`，该方法接收多个参数，第一个参数是目标对象，其余则是来源对象。但使用该方法进行拷贝有一些限制，比如不会拷贝对象的继承属性、不会拷贝对象的不可枚举属性等。但可以拷贝`symbol`类型的属性，但对象只有一层的时候，是深拷贝
- 扩展运算符：`let cloneObj = {...obj}`
- 数组方法：`concat()`
- 拷贝一维数组：`arr.slice()`


### 深拷贝

完全拷贝一个新对象，修改数据不会互相影响，常用`JSON.parse(JSON.stringify(obj))`方法来进行深拷贝，但`JSON.stringify()`是将对象或者数组转换为一个JSON字符串，但不能接受函数，所以这种方法可以实现深拷贝，但函数无法复制，当键为`函数`、`undefined`、`symbol`时，无法拷贝

为了完全复制一个对象且修改后不相互影响，常用 JSON.parse(JSON.stringify(obj)) 实现深拷贝。但这种方法在序列化时无法处理函数、undefined 和 symbol 类型的键，导致这些值无法被复制

1. 拷贝对象的值中如果有函数、undefined、symbol这几种类型，经过stringfy序列化后的字符串中这个键值对会消失
2. 拷贝Date引用类型会变成字符串
3. 无法拷贝不可枚举的属性
4. 无法拷贝对象的原型链
5. 拷贝正则引用类型会变成空对象
6. 对象中含有NaN、Infinity及-Infinity，序列化的结果会变成null
7. 无法拷贝对象的循环引用


```js
let obj = {a: {b: 1}}

function deepClone (obj) {
  let cloneObj = {}
  for(let key in obj) {
    if(typeof obj[key] === 'object') {
      cloneObj[key] = deepClone(obj[key])
    } else {
      cloneObj[key] = obj[key]
    }
  } 
  return cloneObj
}

let obj2 = deepClone(obj)
```


## 深浅拷贝的手动实现

### 浅拷贝

1. 对基本类型做一个基本的拷贝
2. 对引用类型开辟一个新的存储，并拷贝一层对象属性

看下面的代码

```js
const shallowClone = (target) => {
  if( target !== 'object' && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {}
    for( let prop in target) {
      if(target.hasOwnProperty(prop)) {
        cloneTarget[prop] = target[prop]
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```

### 深拷贝

**方法1**：递归

for in传入参数，遍历参数的属性值，是引用类型就再次递归调用该函数。如果是基础类型，则直接复制值

```js
let obj = {a: {b: 1}}

function deepClone (obj) {
  let cloneObj = {}
  for(let key in obj) {
    if( typeof obj[key] === 'object') {
      cloneObj[key] = deepClone(obj[key])
    } else {
      cloneObj[key] = obj[key]
    }
  } 
  return cloneObj
}

let obj2 = deepClone(obj)

// 不知道具体什么功能的拷贝函数

function cloneObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = cloneObject(obj[key])
    }
  }
  return result
}
```

1. 这个深拷贝函数并不能复制不可枚举属性和Symbol类型
2. 这种方法只针对普通引用类型的值做递归复制。而对于数组，日期函数，正则、错误对象、function这种引用类型并不能进行拷贝
3. 对象属性里面成环，即循环引用没有解决

另一种深拷贝

```javascript
const obj1 = { name: 'Alice', age: 20, sayName: function() { console.log(this.name) } }
const obj2 = cloneObject(obj1)
obj2.age = 25
obj2.sayName() // 输出 "Alice"

function cloneObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'function') {
        result[key] = obj[key].bind(result)
      } else {
        result[key] = cloneObject(obj[key])
      }
    }
  }
  return result
}
```



```javascript
function deepCopy(obj) {
  // 检查参数类型
  if (typeof obj !== "object" || obj === null) {
    return obj
  }

  // 创建新的对象或数组
  const result = Array.isArray(obj) ? [] : {}

  // 递归拷贝属性
  for (let key in obj) {
    // 排除原型链上的属性
    if (obj.hasOwnProperty(key)) {
      result[key] = deepCopy(obj[key])
    }
  }

  return result
}
```

这个函数的基本思路是检查参数类型，创建一个新的对象或数组，然后递归地拷贝属性。它会递归处理对象和数组中的每一个属性，以确保所有属性都被正确地拷贝。需要注意的是，这个实现并不处理循环引用的情况，因为处理循环引用需要一些额外的处理逻辑，例如记录已经处理过的对象的引用等。
user: 写一点测试用例
assistant: 好的，以下是一些测试用例：

```javascript
const originalObj = {
  name: 'Alice',
  age: 20,
  address: {
    city: 'Shanghai',
    country: 'China'
  },
  friends: [
    { name: 'Bob', age: 21 },
    { name: 'Charlie', age: 22 },
  ]
}

// 测试对象深拷贝是否成功
const newObj = deepClone(originalObj)
console.log(newObj) // 期望输出: { name: 'Alice', age: 20, address: { city: 'Shanghai', country: 'China' }, friends: [ { name: 'Bob', age: 21 }, { name: 'Charlie', age: 22 } ] }
console.log(newObj === originalObj) // 期望输出: false
console.log(newObj.address === originalObj.address) // 期望输出: false
console.log(newObj.friends[0] === originalObj.friends[0]) // 期望输出: false

// 测试数组深拷贝是否成功
const originalArr = [1, 2, [3, 4], { name: 'Alice', age: 20 }]
const newArr = deepClone(originalArr)
console.log(newArr) // 期望输出: [ 1, 2, [ 3, 4 ], { name: 'Alice', age: 20 } ]
console.log(newArr === originalArr) // 期望输出: false
console.log(newArr[2] === originalArr[2]) // 期望输出: false
console.log(newArr[3] === originalArr[3]) // 期望输出: false
```