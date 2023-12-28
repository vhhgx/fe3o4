# Promise

## 简述


一个异步解决方案 有三个主要状态：pending（等待中）、fulfilled（已解决）、和rejected（已拒绝）。这些状态是不可逆的，一旦一个Promise的状态发生变化，它就会保持这个状态。处理Promise的结果主要依赖.then方法，它接受两个可选的回调函数参数：第一个用于处理状态为fulfilled时的情况，第二个处理rejected状态。为了更加有效地捕获和处理错误，通常推荐使用.catch方法，专门用于处理Promise被拒绝的情况

ECMA在异步处理上除了Promise，还提供了[迭代器和生成器](/core/base/generator)，它们允许以同步方式处理异步流程。此外，为了简化使用，还引入了 [async和await](/core/base/async)，作为生成器的语法糖，进一步优化异步编程体验


```js
let p = new Promise(function(resolve,reject){
  resolve('promise')
})
console.log(p) // 打印 Promise {<fulfilled>: 'promise'}
```

## 静态方法

参数为数组，其元素是promise对象，其返回值分别为

- all：全部成功，若有失败则返回第一个失败对象的返回值
- any：任一成功
- allSettled：全部执行，即无论失败获成功，都会返回所有对象的结果
- race：任一执行，任意一个对象状态改变即可，无论成功或失败

<!-- 

- 用async标识的函数，一定返回promise
- await等待的则一定是一个promise的完成 -->



::: details 执行顺序
```js
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})then(function() {
  console.log('promise1')
}).then(function() {
  console.log('promise2')
})

console.log('script end')
```
:::

输出结果应该为

::: details 执行结果
```js
script start
async2 end
Promise
script end
async1 end
promise1
promise2
setTimeout
```
:::

因为async await返回的是一个promise对象，所以可以改成如下内容

::: details 更改后
```js
// 1. script start
console.log('script start')

async function async1() {
  new Promise(resolve => {
    // 2. async2 end
    async2()
    resolve()
  }).then(()=>{
    // 5. async1 end
    console.log('async1 end')
  })
}

async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  // 8. setTimeout
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  // 3. promise
  console.log('Promise')
  resolve()
})then(function() {
  // 6. promise1
  console.log('promise1')
}).then(function() {
  // 7. promise2
  console.log('promise2')
})

// 4. script end
console.log('script end')
```
:::
