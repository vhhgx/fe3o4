# 迭代器与生成器

## 迭代器

实现了Iterable接口的基础数据结构，即可称为可迭代对象。每个迭代器都会关联一个可迭代对象。

而实现Iterable接口需要暴露一个属性作为默认迭代器，且这个属性需要使用Symbol.iterator作为键，值为迭代器工厂函数，调用这个函数则返回新迭代器，比如


```js
let arr = [1, 2, 3]
// 输出 ƒ values() { [native code] }
console.log(arr[Symbol.iterator])

// 输出 Array Iterator {}
console.log(arr[Symbol.iterator]())
```

迭代器API使用`next()`方法在可迭代对象中遍历数据，每一次调用都会返回一个对象 `{done: false, value: ''}`，当迭代结束，则会返回 `{done: true, value: undefined}`


## 生成器

生成器函数，定义时使用 function* func() 形式，其中星号 * 对空格不敏感。调用这种函数会创建一个生成器对象。此对象初始状态为暂停（suspended），且遵循迭代器（Iterator）接口，允许使用 next() 方法进行操作

生成器可借助 yield 关键字暂停（或中断）其执行。遇到 yield，执行暂停，同时保持当前函数作用域状态。暂停的生成器函数只能通过再次调用 next() 方法来恢复执行

yield 只能在生成器中使用，在其他位置会报错

```js
const gene = function * () {
  const a = yield 'step1'
  console.log(a)
  
  const b = yield new Promise((res, rej) => {
    setTimeout(() => {
      res('promise返回值')
    }, 1000)
  })
  console.log(b)
  
  const c = yield 'step2'
  console.log(c)
}

const genes = gene()

genes // 直接打印该对象，会输出gene {<suspended>}
genes.next() // 输出 {value: 'step1', done: false}
genes.next() // 输出 Promise {<pending>}
genes.next() // 输出 {value: 'step2', done: false}
genes.next() // 直到 {value: undefined, done: true}
```


如果在过程中遇到了 [Promise](/core/base/promise) 对象，则会等待promise执行完毕再进行下一步



### 结合生成器与Promise 同步化异步流程

```js
function runner (fn) {
  // 创建生成器函数
  let gene = fn()
  // 执行
  let step = gene.next()
  // 定义递归函数
  const loop = (args, generator) => {
    // 获取本次的结果
    let value = args.value

    // 判断是否为Promise对象
    if (value instanceof Promise) {
      value.then((res) => {
        console.log(res)
        if (args.done === false) {
          loop(gene.next(res), gene)
        }
      })
    } else {
      if (args.done === false) {
        loop(args.value, gene)
      }
    }
  }

  // 传入上一次执行的结果和生成器
  loop(step, gene)
}

function * test(){
  var res1 = yield new Promise(function(resolve){
    setTimeout(function(){
      resolve('第一秒运行')
    },1000)
  })
  console.log(res1)
  var res2 = yield new Promise(function(resolve){
    setTimeout(function(){
      resolve('第二秒运行')
    },1000)
  })
  console.log(res2)
  var res3 = yield new Promise(function(resolve){
    setTimeout(function(){
      resolve('第三秒运行')
    },1000)
  })
  console.log(res3)
}
runner(test)
```

上面的代码中向next传入了参数res对应promise解决的结果，作为了res1的值。因为yield对程序进行了挂起，若不传值则会取默认值undefined，导致无法输出期望的内容。

通过上面的方法就可以将原本的异步代码以同步的方式进行书写，更易于阅读。在此基础上ES8使用async和awati的语法糖将其进行了实现


在上述代码中，next 方法接收的参数 res 是 Promise 解决的结果，赋值给了 res1。不传参时，yield 默认返回 undefined，影响期望输出

这种写法使异步代码能以同步风格表达，提升了可读性。ES8 的 [async & await](/core/base/async) 是这一模式的语法简化，进一步优化了异步代码的处理