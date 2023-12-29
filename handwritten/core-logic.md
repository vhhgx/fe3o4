# JS 手写代码 - 逻辑 & 业务相关

## URL 与 JSON 互相转换

```js
const url = 'https://www.douyin.com/abc?foo=1&bar=2'
const urlObj = urlToObj(url)
console.log(urlObj)
// 输出
// {
//     path: 'https://www.douyin.com/abc',
//     query: {
//         foo: '1',
//         bar: '2'
//     }
// }

function urlToObj(url) {
  let obj = {}
  let result = new URL(url)

  result.searchParams.forEach((val, key) => {
    obj[key] = val
  })

  return {
    path: `${result.origin}${result.pathname}`,
    query: obj,
  }
}

urlObj.query.coo = '3'
const newUrl = objToUrl(urlObj)
console.log(newUrl) // 输出 https://www.douyin.com/abc?foo=1&bar=2&coo=3

function objToUrl(obj) {
  let path = obj.path
  let url = ''
  let u = Object.entries(obj.query)

  u.forEach((val) => {
    url += `${val[0]}=${val[1]}`
  })

  return `${path}?${url}`
}
```

## 数组拍平

```js
function flatten(arr) {
  let res = []
  arr.forEach((val) => {
    if (Array.isArray(val)) {
      res = res.concat(flatten(val))
    } else {
      res.push(val)
    }
  })
}

flatten([1, 2, [3, 4, 5, [6, 7, 8], 9], 10, [11, 12]])
```

## 使用 es5 实现 es6 的 let 关键字

```js
;(function () {
  var a = 1
  console.log(a)
})()

console.log(a)
```

## 发布订阅模式

```js
class eventBus {
  constructor() {
    this.events = {}
  }

  subscribe(event, cb) {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(cb)
  }

  unsubscribe(event, cb) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((val) => val !== cb)
    }
  }

  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((val) => {
        val(data)
      })
    }
  }
}
```

## instanceof

```js
function myInstance(left, right) {
  let leftproto = left.__proto__
  let rightproto = right.prototype

  while (true) {
    if (leftproto == null) {
      return false
    }
    if (leftproto == rightproto) {
      return true
    }

    leftproto = leftproto.__proto__
  }
}
```

## 实现一个柯里化函数

```js
function curry(fn) {
  // 返回一个新函数，用于收集参数
  return function curried(...args) {
    // 检查当前已收集的参数数量是否足以执行原函数
    if (args.length >= fn.length) {
      // 如果足够，执行原函数
      return fn.apply(this, args)
    } else {
      // 如果不够，返回一个新函数，用于继续收集参数
      return function (...args2) {
        // 将之前和现在的参数一起传递给curried函数
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}

// 示例使用
function sum(a, b, c) {
  return a + b + c
}

const curriedSum = curry(sum)

console.log(curriedSum(1)(2)(3)) // 输出 6
console.log(curriedSum(1, 2)(3)) // 也输出 6
console.log(curriedSum(1, 2, 3)) // 同样输出 6
```

## 浅拷贝

只复制一层

```js
function shallowCopy(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }

  let res = Array.isArray(obj) ? [] : {}

  for (let key in obj) {
    if (obj.hasProperty(key)) {
      res[key] = obj[key]
    }
  }

  return res
}
```

## 深拷贝

这里的内容就比较多，复制各种普通类型和深层次对象，还有 Date 等对象

```js
// 除了上面的递归调用
function deepCopy(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }

  let res = Array.isArray(obj) ? [] : {}

  for (let key in obj) {
    if (obj.hasProperty(key)) {
      res[key] = deepCopy(obj[key])
    }
  }

  return res
}

// 还有更复杂的
function deepCopy(obj, cache = new WeekMap()) {
  if (typeof obj !== 'object' || obj === null || typeof obj === 'function') {
    return obj
  }

  if (cache.has(obj)) {
    return cache.get(obj)
  }

  let val

  // 数组
  if (Array.isArray(obj)) {
    val = []
  } else if (obj instanceof Date) {
    val = new Date(obj)
  } else if (obj instanceof RegExp) {
    val = new Reg(obj.source, obj.flags)
  } else {
    val = Object.create(Object.getPrototypeOf(obj))
  }

  cache.set(obj, val)

  Object.keys(obj).forEach((key) => {
    val[key] = deepCopy(obj[key], cache)
  })

  return val
}
```

## 数字格式化、四舍五入、千位符

```js
let formatMoney = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
let money = formatMoney(986542135)
console.log('money ==> ', money) // "986,542,135"
```

## 生成随机数

```js
function uuid(length = 8, chars) {
	chars = chars || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	let result = ''
	for(let i = 0 i < length i++) {
		result += chars[Math.floor(Math.random() * chars.length)]
	}
	return result
}
```

## 数组去重

```js
const arr = [1, 2, 3, 3, 4, 4, 5]
// 使用Set
const uniqueArr = [...new Set(arr)]

// 使用filter
const uniqueArr = arr.filter((item, index, array) => {
  return array.indexOf(item) === index
})

// 使用includes
let uniqueArr = []

for (let i = 0; i < arr.length; i++) {
  if (!uniqueArr.includes(arr[i])) {
    uniqueArr.push(arr[i])
  }
}

// 使用reduce
uniqueArr = arr.reduce((prev, curr) => {
  if (!prev.includes(curr)) {
    prev.push(curr)
  }
}, [])

console.log(uniqueArr) // [1, 2, 3, 4, 5]
```

## promise

```js
class Pro {
  constructor(fn) {
    this.state = 'pending'
    this.value = ''
    this.reason = ''
    this.onFulfilledCbs = []
    this.onRejectedCbs = []

    resolve(value) {
      if (this.state == 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onFulfilledCbs.forEach((item) => item())
      }
    }

    reject(reason) {
      if (this.state == 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCbs.forEach((item) => item())
      }
    }

    try {
      fn(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    }

    if (this.state === 'rejected') {
      onRejected(this.reason);
    }

    if (this.state === 'pending') {
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });

      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}
```

## promise.all()

```js
SimplePromise.all = function (promises) {
  return new SimplePromise((resolve, reject) => {
    let results = []
    let completed = 0
    for (let i = 0; i < promises.length; i++) {
      SimplePromise.resolve(promises[i])
        .then((value) => {
          results[i] = value
          completed++
          if (completed === promises.length) {
            resolve(results)
          }
        })
        .catch(reject) // 如果任何一个 Promise 失败
    }
  })
}
```

## JSON.parse(JSON.stringify())

```js

```

## 模拟实现 Java 中的 sleep 函数

```js

```

## 实现一个简单的模板引擎

要求实现一个简单的模板引擎，可以根据传入的数据和模板，生成最终的 HTML 代码。

```js
function templateEngine(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
    return data[key] !== undefined ? data[key] : ''
  })
}

// 示例使用
const template = '<h1>{{title}}</h1><p>{{content}}</p>'
const data = {
  title: 'Hello World',
  content: 'This is a simple template engine.',
}

const result = templateEngine(template, data)
console.log(result)
```

## 设计一个调度程序，可以让 Promise 并发执行，但是最多只能有 5 个任务在执行

```js
class PromiseScheduler {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent // 最大并发数限制
    this.currentRunning = 0 // 当前正在执行的任务数量
    this.taskQueue = [] // 待执行的任务队列
  }

  // 添加任务到调度器
  addTask(promiseFunction) {
    return new Promise((resolve, reject) => {
      // 任务包装器，将真正的任务封装起来
      const task = this.createTask(promiseFunction, resolve, reject)

      if (this.currentRunning < this.maxConcurrent) {
        // 如果当前执行的任务数小于最大并发数，立即执行任务
        task()
      } else {
        // 否则，将任务添加到队列中等待执行
        this.taskQueue.push(task)
      }
    })
  }

  // 创建一个任务，接收一个返回 Promise 的函数和原 Promise 的 resolve 和 reject
  createTask(promiseFunction, resolve, reject) {
    return () => {
      // 开始执行任务，当前运行任务数加一
      this.currentRunning++
      promiseFunction()
        .then(resolve) // 任务完成后调用原 Promise 的 resolve
        .catch(reject) // 任务失败时调用原 Promise 的 reject
        .finally(() => {
          // 无论任务成功还是失败，都将当前运行任务数减一
          this.currentRunning--
          if (this.taskQueue.length > 0) {
            // 如果队列中还有任务，取出队列中的下一个任务并执行
            const nextTask = this.taskQueue.shift()
            nextTask()
          }
        })
    }
  }
}

// 使用示例
const scheduler = new PromiseScheduler(5) // 创建一个最大并发数为5的调度器

const timeout = (time) => new Promise((res) => setTimeout(res, time))

// 添加10个任务到调度器
for (let i = 0; i < 10; i++) {
  scheduler.addTask(() =>
    timeout(1000).then(() => console.log(`Task ${i} completed`))
  )
}
```

### 实现一个方法以比较两个版本号的大小

```js
// 调用参考
compareVersion('1.0.3', '1.0.5') // 返回 -1
compareVersion('1.0.7', '1.0.5') // 返回 1
compareVersion('1.1.3', '1.0.5') // 返回 1
```

```js
function compareVersion(v1, v2) {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0
    const num2 = parts2[i] || 0

    if (num1 > num2) return 1
    if (num1 < num2) return -1
  }
  return 0
}
```

### 按照版本号由小到大排序

把上面的作为 sort 函数的回调即可

```js
function compareVersion(v1, v2) {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0
    const num2 = parts2[i] || 0

    if (num1 > num2) return 1
    if (num1 < num2) return -1
  }
  return 0
}

// 示例输入
const versions = ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']
// 对版本号数组进行排序
const sortedVersions = versions.sort(compareVersion)
// 输出  ['0.1.1', '0.302.1', '2.3.3', '4.2', '4.3.4.5', '4.3.5']
console.log(sortedVersions)
```

### 【代码题】数字转字符串

样例输入：1234567890
样例输出：1,234,567,890

```js
return num.toLocaleString()

function toString(num) {

  const result = []
  const str = `${num}`.split('').reverse()

  for (let i = 0 i < str.length i++) {
    if (i && i % 3 === 0) {
      result.push(',')
    }
    result.push(str[i])
  }
  return result.reverse().join('')
}
```

## 将奇数排在前面，偶数排在后面。要求时间复杂度 O(n)。空间复杂度 O(1)（不能用 splice）

```js

```

## 【代码题】查找多个字符串中最长公共前缀

样例输入：strs = ['abcdef', 'abdefw', 'abc']
输出：'ab'，若没有找到公共前缀则输出空字符串

```js
function findLongestCommonPrefix(strs) {
  if (strs.length === 0 || strs.includes('')) return ''

  // 找到最短的字符串
  let shortest = strs.reduce((shortest, str) =>
    shortest.length <= str.length ? shortest : str
  )

  // 检查每个字符
  for (let i = 0; i < shortest.length; i++) {
    // 如果当前字符不是所有字符串的公共前缀，则返回当前已找到的前缀
    if (!strs.every((str) => str[i] === shortest[i])) {
      return shortest.slice(0, i)
    }
  }

  // 最短字符串本身就是最长公共前缀
  return shortest
}

// 样例输入
const strs = ['abcdef', 'abdefw', 'abc']
console.log(findLongestCommonPrefix(strs)) // 输出：'ab'
```

## 字符串解码

样例输入：s = "3[a2[c]]"
样例输出：accaccacc

```js
function decodeString(s) {
  const stack = []
  let numStr = ''
  let i = 0

  while (i < s.length) {
    //  判断是否是数字
    if (!isNaN(+s[i])) {
      numStr += s[i]
    } else {
      //  考虑多位数字的情况
      if (numStr) {
        stack.push(numStr)
        numStr = ''
      }

      //  当遇到右括号的时候执行出栈的逻辑
      if (s[i] === ']') {
        const temp = []
        //  这里简单处理不考虑异常输入的情况
        while (true) {
          const current = stack.pop()
          //  如果出栈的时候遇到左括号就用前一个值计算当前字符串
          //  并且把当前字符串作为一个新的值入栈（即把多层嵌套解析后的值作为一个新的字符串整体考虑）
          //  这里字符串链接的时候需要注意逆序一下，不然顺序会反
          if (current === '[') {
            const num = +stack.pop()
            const tempResult = Array(num).fill(temp.reverse().join('')).join('')
            stack.push(tempResult)
            break
          } else {
            temp.push(current)
          }
        }
        //  其他情况直接入栈即可
      } else {
        stack.push(s[i])
      }
    }
    i++
  }

  return stack.join('')
}
```

## 查找有序数组中数字最后一次出现的位置

输入：nums = [5,7,7,8,8,10], target = 8
输出：4

```js
function findLastPosition(nums, target) {
  let left = 0
  let right = nums.length - 1
  let result = -1

  while (left <= right) {
    let mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) {
      result = mid // 找到一个目标值，记录位置并继续在右侧查找
      left = mid + 1 // 移动左边界以继续查找可能的更后面的目标值
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return result
}

// 示例
const nums = [5, 7, 7, 8, 8, 10]
const target = 8
console.log(findLastPosition(nums, target)) // 输出 4
```

## 数组转树结构

```js

```

## 实现一个 compare 函数，比较两个对象是否相同

```js

```

## 大数相加

```js

```

## 实现一个函数计算 "1+12-31+100-93"

```js

```

## 中划线转大写

```js

```

## 编写一个函数，传入一个 promise 和数字 n，n(s)内 promise 没有返回结果，直接 reject

```js

```

## 手写括号匹配

```js

```
