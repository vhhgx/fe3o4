# JS 手写代码 - 高频手写题

一些高频的手写代码题

## 防抖函数

防抖函数的作用是使用定时器，延迟执行这个函数，常用于用户输入验证和请求发送等场景。

```javascript
function debounce(fn, wait) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}

function sayDebounce() {
  console.log('防抖成功！')
}

let deb = debounce(sayDebounce, 1000)
deb()
```

## 节流函数

使用定时器，在一段时间内只执行一次

节流函数的实现原理是使用时间戳来记录上一次执行事件处理函数的时间，并计算距离上一次执行的时间间隔。如果间隔时间大于指定的延迟时间，则立即执行事件处理函数，并更新上一次执行的时间戳。如果间隔时间小于指定的延迟时间，则清除之前的定时器，并设置一个新的定时器，在延迟时间之后执行事件处理函数，并更新上一次执行的时间戳

节流函数的作用是在一段时间内，多次触发同一个事件，只执行一次事件处理函数。常用于 scroll、resize 等事件的监听和处理。

频繁触发的时候，比如滚动或连续点击，在指定的间隔时间内，只会执行一次。应用场景：resize、scroll 等

```javascript
function throttle(fn, delay) {
  let timer = null
  let lastTime = 0
  return function (...args) {
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

function handleScroll() {
  console.log('Window scrolled!')
}

// 创建一个节流版本的handleScroll函数，限制为每200毫秒最多执行一次
const throttledScroll = throttle(handleScroll, 200)

// 将节流函数应用于滚动事件
window.addEventListener('scroll', throttledScroll)
```

## 深拷贝

```js
function deepCopy(obj) {
  // 只处理对象和数组
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepCopy(item));
  }

  // 处理对象
  let copy = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }
  return copy;
}

// 使用示例
const original = { a: 1, b: { c: 2, d: [3, 4] } };
const copied = deepCopy(original);
console.log(copied); // { a: 1, b: { c: 2, d: [3, 4] } }
```
