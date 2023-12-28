# JS 手写代码 - 逻辑 & 业务相关

## 数字格式化、四舍五入、千位符

```js
let formatMoney = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
let money = formatMoney(986542135)
console.log('money ==> ', money) // ""986,542,135""
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

## 数组打乱

## 数组去重

```js
let unique3 = (arr) => {
  let brr = []
  arr.forEach((item) => {
    // 使用 indexOf  返回数组是否包含某个值 没有就返回 -1 有就返回下标
    if (brr.indexOf(item) === -1) brr.push(item)
    // 或者使用 includes 返回数组是否包含某个值  没有就返回false  有就返回true
    if (!brr.includes(item)) brr.push(item)
  })
  return brr
}
```

实现数组去重的方法有很多种，下面列举几种常见的方法：

1. 使用 Set 数据结构。Set 是 ES6 中新增的一种数据结构，它可以用来存储一组唯一的值。我们可以利用 Set 的特性来实现数组去重，例如：

   ```javascript
   const arr = [1, 2, 3, 3, 4, 4, 5]
   const uniqueArr = [...new Set(arr)]
   console.log(uniqueArr) // [1, 2, 3, 4, 5]
   ```

2. 使用数组的 filter() 方法。filter() 方法可以根据条件过滤出数组中的元素，我们可以利用该方法来过滤掉重复的元素，例如：

   ```javascript
   const arr = [1, 2, 3, 3, 4, 4, 5]
   const uniqueArr = arr.filter((item, index, array) => {
     return array.indexOf(item) === index
   })
   console.log(uniqueArr) // [1, 2, 3, 4, 5]
   ```

3. 使用对象属性来判断。我们可以利用对象属性的唯一性来判断数组中的元素是否重复，例如：

   ```javascript
   const arr = [1, 2, 3, 3, 4, 4, 5]
   const obj = {}
   const uniqueArr = arr.filter((item) => {
     return obj.hasOwnProperty(typeof item + item)
       ? false
       : (obj[typeof item + item] = true)
   })
   console.log(uniqueArr) // [1, 2, 3, 4, 5]
   ```

4. 使用 ES6 中的 Map 数据结构。Map 可以存储键值对，并且键可以是任何类型的值，可以利用 Map 的特性来实现数组去重，例如：

   ```javascript
   const arr = [1, 2, 3, 3, 4, 4, 5]
   const map = new Map()
   const uniqueArr = arr.filter((item) => {
     return !map.has(item) && map.set(item, 1)
   })
   console.log(uniqueArr) // [1, 2, 3, 4, 5]
   ```

5. 使用 reduce

可以使用 reduce 方法来实现数组去重。遍历数组，将每个元素作为键值存储在一个对象中，使用 Object.keys 方法将对象的键名转为数组，即可得到去重后的数组。

```javascript
function unique(arr) {
  return arr.reduce((prev, curr) => {
    if (!prev.includes(curr)) {
      prev.push(curr)
    }
    return prev
  }, [])
}

const arr = [1, 2, 2, 3, 3, 4]
console.log(unique(arr)) // [1, 2, 3, 4]
```

4. 使用 includes

可以使用 includes 方法来判断当前元素是否已经在结果数组中，若不在，则将其加入结果数组。

```javascript
function unique(arr) {
  const res = []
  for (let i = 0 i < arr.length i++) {
    if (!res.includes(arr[i])) {
      res.push(arr[i])
    }
  }
  return res
}

const arr = [1, 2, 2, 3, 3, 4]
console.log(unique(arr)) // [1, 2, 3, 4]
```

### 实现一个方法以比较两个版本号的大小

```js
// 调用参考
compareVersion('1.0.3', '1.0.5') // 返回 -1
compareVersion('1.0.7', '1.0.5') // 返回 1
compareVersion('1.1.3', '1.0.5') // 返回 1
```

```js
function compareVersion(source, target) {}
```

### 【代码题】按照版本号由小到大排序

样例输入：versions = ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']
输出：['0.1.1', '0.302.1', '2.3.3', '4.3.4.5', '4.3.5']

js 复制代码 function compareVersions(versions) {
return versions.sort((a, b) => {
const tempA = a.split('.')
const tempB = b.split('.')
const maxLen = Math.max(tempA.length, tempB.length)
for (let i = 0 i < maxLen i++ ) {
const valueA = +tempA[i] || 0
const valueB = +tempB[i] || 0
if (valueA === valueB) {
continue
}
return valueA - valueB
}
return 0
})
}

### 【代码题】数字转字符串

样例输入：1234567890
样例输出：1,234,567,890

js 复制代码 function toString(num) {
// 这是最简单的写法
// return num.toLocaleString()
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

## 实现一个数组扁平化函数

要求实现一个简单的数组扁平化函数，可以将嵌套的数组转化为一维数组。

```js

```

## 将奇数排在前面，偶数排在后面。要求时间复杂度 O(n)。空间复杂度 O(1)（不能用 splice）

## URL 与 JSON 互相转换

```js
// 调用参考
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
urlObj.query.coo = '3'
const newUrl = objToUrl(urlObj)
console.log(newUrl)
// 输出 https://www.douyin.com/abc?foo=1&bar=2&coo=3
```

```js
function urlToObj(url) {}

function objToUrl(obj) {}
```

## 页面路由

js 如何实现页面地址发生变化，但页面不发生跳转，请用 js 实现

```js

```

## 【代码题】查找多个字符串中最长公共前缀

样例输入：strs = ['abcdef', 'abdefw', 'abc']
输出：'ab'，若没有找到公共前缀则输出空字符串

js 复制代码 const findCommonPrefix = arr => {
let str = ''
const n = arr.map(item => item.length).sort()[0]
for (let i = 0 i < n i++) {
str += arr[0][i]
if (arr.some(item => !item.startsWith(str)) {
return str.slice(0, str.length - 1)
}
}
return str
}

## 【代码题】字符串解码

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

## 【代码题】查找有序数组中数字最后一次出现的位置

输入：nums = [5,7,7,8,8,10], target = 8
输出：4

js 复制代码// 最简答的方式就是直接遍历然后根据有序的条件找到当前值等于目标且下一个值不等于目标的结果
// 写出来之后面试官问了时间复杂度，这个就是单层循环的 O(N)，最坏情况就是刚好最后一个值是目标值
const findLast = (nums, target) => {
for (let i = 0 i < nums.length i++) {
if (target === nums[i] && target !== nums[i + 1]) {
return i
}
}
return -1
}

// 问有没有更好的方式，就想到了二分查找，对于已经有序的数组，只需要通过双指针不断更新左右边界位置就行
// 二分法最主要的就是寻找二分结束的边界条件，这里选择所有的查找最后都只剩两个值
// 然后对这两个值再额外判断一下是否符合结果
// 面试官继续追问二分法的时间复杂度，这个我有点懵，不过考虑跟递归差不多，所以就回答了 O(logN)，应该是没错
// 二分查找最坏的情况是刚好第一个值或者最后一个值，或者中间值是目标值
const findLast2 = (nums, target) => {
let left = 0
let right = nums.length - 1
while (right > left + 1) {
const mid = Math.floor((left + right) / 2)
if (nums[mid] > target) {
right = mid - 1
} else {
left = mid
}
}
if (nums[right] === target) {
return right
}
if (nums[left] === target) {
return left
}
return -1
}

```js

```

## 数组转树结构

```js

```

## 解析出 URL 中所有的部分

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

## 手写 Promise.all / Promise.race / Promise.allSettled

```js

```

## 使用 es5 实现 es6 的 let 关键字

```js

```
