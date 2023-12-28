# JS 手写代码 - 原生 API

一些 JS 原生 api 的手写实现

## call

```js
var obj = { a: 1 }
function foo(a, b) {
  console.log(this.a, a + b)
}

// 手写实现
Function.prototype.myCall = function (context) {
  // 因为foo调用了myCall，所以这里的this就是pre函数本身
  if (typeof this !== 'function') {
    throw new TypeError('myCall must be called on a function')
  }
  // 解构类数组来获取参数，将其放入一个新数组或强制转换为数组
  let args = [...arguments].slice(1)

  // 这里context就是传入的obj，所以此时fn的上下文就变成了obj
  // 整个手写的关键点就在这里，把obj的上下文指给foo
  context.fn = this
  // 在obj的上下文中，调用foo函数处理参数
  let res = context.fn(...args)
  delete context.fn // 删除暂存

  return res
}

foo.myCall(obj, 2, 3) // 调用，输出1和5
```

## apply

call 和 apply 仅在参数有所不同，所以把上面的改一下参数即可

```js
var obj = { a: 1 }
function foo(arr) {
  console.log(this.a, ...arr)
}

// 手写实现
Function.prototype.myApply = function (context) {
  // 因为foo调用了myCall，所以这里的this就是pre函数本身
  if (typeof this !== 'function') {
    throw new TypeError('myApply must be called on a function')
  }
  // 解构类数组来获取参数，将其放入一个新数组或强制转换为数组
  let args = [...arguments].slice(1)

  // 这里context就是传入的obj，所以此时fn的上下文就变成了obj
  // 整个手写的关键点就在这里，把obj的上下文指给foo
  context.fn = this
  // 在obj的上下文中，调用foo函数处理参数
  let res = context.fn(...args)
  delete context.fn // 删除暂存

  return res
}

foo.myApply(obj, [2, 3]) // 调用，分别输出1 2 3
```

## bind

```js
Function.prototype.myBind = function (ctx, ...args) {
  const self = this
  const fn = function () {}
  const bind = function () {
    const _this = this instanceof fn ? this : ctx
    return self.apply(_this, [...args, ...arguments])
  }
  fn.prototype = this.prototype
  bind.prototype = new fn()
  return bind
}

var obj = { a: 1 }
function foo(a, b) {
  console.log(this.a, a + b)
}

// 改造后的 myBind 方法
Function.prototype.myBind = function (context, ...outerArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('myBind must be called on a function')
  }

  // 和上面一样 这里的this是foo 保存一下当前函数引用
  const self = this
  // 创建一个空函数，用于原型链继承
  function fn() {}

  // 实际的绑定函数
  function boundFunction(...innerArgs) {
    // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值。
    // 反之，如果普通函数方式调用，this 指向 window，应用传入的 context。
    const contextToUse = this instanceof fn ? this : context
    return self.apply(contextToUse, [...outerArgs, ...innerArgs])
  }

  // 维护原型关系
  if (this.prototype) {
    fn.prototype = this.prototype
  }
  // 使 boundFunction.prototype 是 fn 的实例，维护原型链
  boundFunction.prototype = new fn()

  return boundFunction
}

// 使用 myBind
const boundFoo = foo.myBind(obj, 2)
boundFoo(3) // 调用，输出1和5
```

另一种更简便的方法

```javascript
const person = { name: 'Alice' }
function sayHi(message) {
  console.log(`${this.name}, ${message}`)
}

Function.prototype.myBind = function (context, ...args1) {
  const fn = this // 保存当前函数
  return function (...args2) {
    return fn.apply(context, [...args1, ...args2])
  }
}

const sayHiToPerson = sayHi.myBind(person, 'hello')
sayHiToPerson() // 输出：Alice, hello
```

## instanceof

能在实例的`原型链`中找到该构造函数的`原型对象`，就返回 true

```js
function Car(make, model, year) {
  this.make = make
  this.model = model
  this.year = year
}
const auto = new Car('Honda', 'Accord', 1998)

console.log(auto instanceof Car) // true
console.log(auto instanceof Object) // true

function myInstanceof(leftValue, rightValue) {
  // 先获取左边表达式的原型
  let leftProto = leftValue.__proto__
  // 再获取右边表达式的原型对象
  let rightProtoType = rightValue.prototype
  // 循环判断左边表达式的原型链上是否有右边的表达式
  while (true) {
    if (leftProto === null) {
      return false
    }
    if (leftProto === rightProtoType) {
      return true
    }
    // 往左边表达式的原型链上的上一层继续查找
    leftProto = leftProto.__proto__
  }
}

myInstanceof(auto, Car) // true
myInstanceof(auto, Object) // true
```

## 深浅拷贝

TODO 深浅拷贝的手写，在 advanced-object 一章中，整理好之后只需要放一个链接过来就可以

## 实现 JSON.stringify() 方法

主要考察对于 JS 各种数据类型的深度和对各种极端的边界情况处理能力

- JSON.parse 方法用于解析 JSON 字符串，构造由字符串描述的 JavaScript 值或对象

  - 第一个参数是需要解析处理的 JSON 字符串
  - 第二个参数是可选参数，提供可选的 reviver 参数。用于在返回对象之前进行变换操作的回调

- JSON.stringfy 方法用于将 JavaScript 对象或值转换为 JSON 字符串
  - 1. 【必选】要转换的对象
  - 2. 【可选】replacer 函数，比如指定的 replace 数组
  - 3. 【可选】用来控制结果字符串里面的间距

先用 typeof 把基础数据类型和引用数据类型区分开

```js
function jsonStr (data) {
  let type = typeof data

  if ( type !== 'object') {
    let result = data
    if( Number.isNaN(data) || data === Infinity) {
      result = "null"
    } else if ( type === 'function' || type === 'undefined' || type === 'symbol') {
      return undefined
    } else if ( type === 'string' ) {
      result = "" + data + ""
    }

    return String(result)
  } else if ( type === null ) {
    return "null"
  } else if ( data.toJSON && typeof data.toJSON === 'function' ) {
    return jsonStringify(data.toJSON())
  } else if ( data instanceof Array ) {
    let result = []
    data.forEach(( item, index ) => {
      if( typeof item === "undefined" || typeof item === "function" || typeof item === "symbol" ) {
        result[index] = "null"
      } else {
        result[index] = jsonStr(item)
      }
    })
    result = "[" + result + "]"
    return result.replace(/'/g, "")
  } else {
    let result = []
    Object.keys(data).forEach( (item, index) => {
      if (typeof item !== "symbol") {
        if( data[item] !== undefined && typeof data[item] !== "function" && typeof data[item] !== "symbol" ) {
          result.push("" + item + "" + ":" jsonStr(data[item]))
        }
      }
    })
    return ("{" + result + "}").replace(/'/g, "")
  }
}

```

手写 JSON.stringfy 方法

JSON.parse 方法用来解析 JSON 字符串，构造由字符串描述的 JS 值或对象

第一个参数是需要解析处理的 JSON 字符串，第二个是可选的 reviver 参数。用于在返回对象之前进行的变换操作的回调（进行一定的操作处理）

```js
JSON.parse('{"p": 2, "q": 5, "": 6}', function (k, v) {
  if (k === '') return v
  return v * 2
})

// Object { p: 4, q: 10, "": 6 }
```

JSON.stringfy

第一个参数必选，传入的是要转换的对象。第二个参数是一个 replace 函数

第三个参数用来控制结果字符串里的间距

## Promise.all()

```js
// 调用参考
const promise1 = new Promise((resolve) => resolve(1))
const promise2 = new Promise((resolve) => resolve(2))
const promise3 = new Promise((resolve) => resolve(3))
const promiseAll = myPromiseAll([promise1, promise2, promise3])
promiseAll.then(function (res) {
  console.log(res) // 输出：[1,2,3]
})
```

```js
function myPromiseAll(promiseArr) {

}




// 掘金的答案

const promise1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(3)
  }, 300)
})

const promise2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(2)
  }, 200)
})

const promise3 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 100)
})

/**
 * 实现 Promise.all()
 * @param promises
 * @returns
 */
function promiseAll(promises: Promise<any>[]) {
  const results = []

  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises))
      return reject(new TypeError('参数应当是一个数组'))

    let resolvedCounter = 0
    for (let i = 0 i < promises.length i++) {
      const p = promises[i]
      Promise.resolve(p).then(
        (res) => {
          resolvedCounter++
          results[i] = res // [3, 2, 1]
          // results.push(res) // [1, 2, 3]

          if (resolvedCounter === promises.length)
            return resolve(results)
        },
        (reason) => {
          return reject(reason)
        },
      )
    }
  })
}

async function test() {
  const promiseArr = [promise1, promise2, promise3]
  const ans = await promiseAll(promiseArr)
  console.log(ans)
}

test()
```

## 实现 promise

要求实现一个简单的 Promise，支持 then 方法，以及可以处理异步操作，并且可以支持链式调用。

重点是需要实现 Promise.then 方法
维护一个 fullfilled 的事件队列和一个 rejected 事件队列
在 Promise.then 方法里需要判断一下当前 Promise 的状态以及参数类型
最后需要实现两个事件队列的自执行，用来处理链式调用的情况
在执行方法时使用 setTimeout 模拟异步任务

```js

```

```js
// 手写promise
class pro {
  constructor(exFn) {
    ;(this.status = 'pending'), (this.value = undefined)
    this.reason = undefined

    let resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
      }
    }
    let reject = (value) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = value
      }
    }

    exFn(resolve, reject) //难点
  }
  then(onFulfilled, onRejected) {
    if (this.status === 'fulfilled') {
      onFulfilled(this.value)
    } else {
      onRejected(this.reason)
    }
  }
}
new pro((res, rej) => {
  res(12)
}).then(
  (value) => {
    console.log(value)
  },
  (reason) => {
    console.log(reason)
  }
)

// 进阶
class ExPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = undefined
    //为链式调用准备,且执行到then时promise的状态还未改变需要存起来
    this.resolveCallBack = []
    this.rejectCallBack = []

    const resolve = (value) => {
      //只有状态为pending的promise才能改变状态
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.resolveCallBack.forEach((callback) => {
          callback()
        })
      }
    }
    const reject = (reason) => {
      //只有状态为pending的promise才能改变状态
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.value = reason
        this.rejectCallBack.forEach((callback) => {
          callback()
        })
      }
    }
    try {
      //内部报错不影响外部，直接reject
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  //传入两个参数
  then(resolveFn, rejectFn) {
    //返回一个新的promise对象
    return new ExPromise((resolve, reject) => {
      const resolveCallback = () => {
        //这里的this是调用then的promise，箭头函数向外遇到箭头函数再向外
        try {
          if (typeof resolveFn === 'function') {
            const result = resolveFn(this.value)
            resolve(result)
          } else {
            //如果不是一个函数，则生成的新promise对象的值还是之前的promise的
            resolve(this.value)
          }
        } catch (error) {
          reject(error)
        }
      }
      const rejectCallback = () => {
        try {
          if (typeof rejectFn === 'function') {
            const result = rejectFn(this.value)
            resolve(result)
          } else {
            //如果不是一个函数，则生成的新promise对象的值还是之前的promise的
            reject(this.value)
          }
        } catch (error) {
          reject(error)
        }
      }
      //这里的this是之前的promsie的
      if (this.status === 'fulfilled') {
        //then中的代码为异步
        setTimeout(resolveCallback, 0)
      } else if (this.status === 'rejected') {
        //then中的代码为异步
        setTimeout(rejectCallback, 0)
      } else {
        //当之前的promsie的状态为pending时
        this.resolveCallBack.push(resolveCallback)
        this.resolveCallBack.push(rejectCallback)
        //为什么会有这种情况且需要是一个数组
        // const a=new ExPromise((resolve, reject) => {
        //           setTimeout(()=>{ resolve(12)},3000)
        // })
        //此时，执行到这里时，a的状态为pending，
        //当之前的promise状态改变时，会执行resolveCallBack数组
        // a.then((value)=>console.log(value))
        //这时就需要一个数组
        // a.then((value)=>console.log(value+1))
      }
    })
  }
}
const a = new ExPromise((resolve, reject) => {
  resolve(12)
})
console.log(a)
console.log(
  a.then((res) => {
    console.log(res + b)
    // return 13
  }, 11)
)

// 添加静态方法
class ExPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = undefined
    //为链式调用准备,且执行到then时promise的状态还未改变需要存起来
    this.resolveCallBack = []
    this.rejectCallBack = []

    const resolve = (value) => {
      //只有状态为pending的promise才能改变状态
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.resolveCallBack.forEach((callback) => {
          callback()
        })
      }
    }
    const reject = (reason) => {
      //只有状态为pending的promise才能改变状态
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.value = reason
        this.rejectCallBack.forEach((callback) => {
          callback()
        })
      }
    }
    try {
      //内部报错不影响外部，直接reject
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  //传入两个参数
  then(resolveFn, rejectFn) {
    //返回一个新的promise对象
    return new ExPromise((resolve, reject) => {
      const resolveCallback = () => {
        //这里的this是调用then的promise，箭头函数向外遇到箭头函数再向外
        try {
          if (typeof resolveFn === 'function') {
            console.log(this, this.value)
            const result = resolveFn(this.value)
            resolve(result)
          } else {
            //如果不是一个函数，则生成的新promise对象的值还是之前的promise的
            resolve(this.value)
          }
        } catch (error) {
          reject(error)
        }
      }
      const rejectCallback = () => {
        try {
          if (typeof rejectFn === 'function') {
            const result = rejectFn(this.value)
            resolve(result)
          } else {
            //如果不是一个函数，则生成的新promise对象的值还是之前的promise的
            reject(this.value)
          }
        } catch (error) {
          reject(error)
        }
      }
      //这里的this调用then的promsie的
      if (this.status === 'fulfilled') {
        //then中的代码为异步
        setTimeout(resolveCallback, 0)
      } else if (this.status === 'rejected') {
        //then中的代码为异步
        setTimeout(rejectCallback, 0)
      } else {
        //当之前的promsie的状态为pending时
        this.resolveCallBack.push(resolveCallback)
        this.resolveCallBack.push(rejectCallback)
        //为什么会有这种情况且需要是一个数组
        // const a=new ExPromise((resolve, reject) => {
        //           setTimeout(()=>{ resolve(12)},3000)
        // })
        //此时，执行到这里时，a的状态为pending，
        //当之前的promise状态改变时，会执行resolveCallBack数组
        // a.then((value)=>console.log(value))
        //这时就需要一个数组
        // a.then((value)=>console.log(value+1))
      }
    })
  }
  catch(rejectFn) {
    return this.then('', rejectFn)
  }
  static resolve(value) {
    return new ExPromise((resolve, reject) => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new ExPromise((resolve, reject) => {
      reject(reason)
    })
  }
  static all(arr) {
    let result = []
    let count = 0
    return new ExPromise((resolve, reject) => {
      for (const promise of arr) {
        promise
          .then((value) => {
            result.push(value)
            if (arr.length === result.length) {
              resolve(result)
            }
          })
          .catch((reason) => {
            //第一个为rejected的promise的值
            reject(reason)
          })
      }
    })
  }
  static race(arr) {
    return new ExPromise((resolve, reject) => {
      for (const promise of arr) {
        promise
          //.then((value)=>resolve(value))
          //下面是终极用法
          //这个resolve是现在新promsie的。是一个函数
          //传递进去执行 const result=    resolveFn(this.value)去改变了状态，目的就达到了
          .then(resolve)
          .catch(reject)
      }
    })
  }
}
```

## 手写数组的 map 方法

```js
// 手写map
let arrp = [1, 2, 35, 8]
function newMap (fnCallback) {
    if (Object.prototype.toString.call(fnCallback) !== '[object Function]') return '必须传一个函数'
    let arr = []
    for (let index = 0 index < this.length index++) {    //不能用for in .会将newMap方法也给算进去（可枚举）
        arr.push(fnCallback(this[index], index, this))
    }
    return arr
}
let a = arrp.newMap((item, index, arrp) => {
    return item += 1
})
console.log(a)
```
