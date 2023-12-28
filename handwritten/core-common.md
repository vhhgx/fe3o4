# JS手写代码 - 高频手写题


一些高频的手写代码题


## 防抖函数

```js
function debounce(fn, wait) {
  let timeout = null
  return function(){
    // 每一次点击判断有延迟执行的任务就停止
    if(timeout !== null) clearTimeout(timeout)
    // 否则就开启延迟任务
    timeout = setTimeout(fn, wait)
  }
}
function sayDebounce() {
  console.log("防抖成功！")
}
btn.addEventListener("click", debounce(sayDebounce,1000))
```


防抖函数的作用是在一段时间内，如果多次触发同一个事件，则只执行一次事件处理函数。常用于用户输入验证和请求发送等场景。

```javascript
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

## 节流函数

频繁触发的时候，比如滚动或连续点击，在指定的间隔时间内，只会执行一次
应用场景：resize、scroll等

```js
// 方案1  连续点击的话，每过 wait 秒执行一次
function throttle(fn, wait) {
  let bool = true
  return function() {
    if(!bool) return
    bool = false
    setTimeout(() => {
      // fn() // fn中this指向window
      fn.call(this, arguments) // fn中this指向btn  下面同理
      btn = true
    }, wait)
  }
}
// 方案2 连续点击的话，第一下点击会立即执行一次 然后每过 wait 秒执行一次
function throttle(fn, wait) {
  let date = Date.now()
  return function() {
    let now = Date.now()
    // 用当前时间 减去 上一次点击的时间 和 传进来的时间作对比
    if (now - date > wait) {
      fn.call(this, arguments)
      date = now
    }
  }
}
// 方案三 结合
function throttle(fn, wait){
  let bool = true, date = Date.now(), timer = null
  return function(){
    clearTimeout(timer)
    let now = Date.now()
    let lave = wait - (now - date)
    if(lave <= 0){
      fn.call(this, arguments)
      date = Date.now()
    }else{
      timer = setTimeout(fn, lave)
    }
  }
}
function sayThrottle() {
  console.log("节流成功！")
}
btn.addEventListener("click", throttle(sayThrottle,1000))
```



节流函数的作用是在一段时间内，多次触发同一个事件，只执行一次事件处理函数。常用于 scroll、resize 等事件的监听和处理。

```javascript
function throttle(fn, delay) {
  let timer = null
  let lastTime = 0
  return function(...args) {
    const nowTime = Date.now()
    if (nowTime - lastTime > delay) {
      fn.apply(this, args)
      lastTime = nowTime
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
        lastTime = nowTime
      }, delay - (nowTime - lastTime))
    }
  }
}
```

节流函数的实现原理是使用时间戳来记录上一次执行事件处理函数的时间，并计算距离上一次执行的时间间隔。如果间隔时间大于指定的延迟时间，则立即执行事件处理函数，并更新上一次执行的时间戳。如果间隔时间小于指定的延迟时间，则清除之前的定时器，并设置一个新的定时器，在延迟时间之后执行事件处理函数，并更新上一次执行的时间戳。


TODO 留一个防抖与节流的区别

## 事件监听器

## 模拟实现Java中的sleep函数

```js

```


## 实现一个简单的发布订阅模式

要求实现一个简单的发布订阅模式，支持订阅事件、取消订阅、发布事件等基本操作。



```js

```

## 实现一个柯里化函数

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

const add = (a, b, c) => a + b + c;
const a1 = currying(add, 1);
const a2 = a1(2);
console.log(a2(3)) // 6
```

## 实现一个简单的模板引擎

要求实现一个简单的模板引擎，可以根据传入的数据和模板，生成最终的 HTML 代码。

```js

```

## 设计一个调度程序，可以让 Promise 并发执行，但是最多只能有 5 个任务在执行

```js

```

