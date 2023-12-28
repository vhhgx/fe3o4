# 模块系统


为了解决全局污染和依赖混乱的问题

ESModule 在静态编译阶段就可以确定模块的依赖关系，因此可以进行静态优化。而 CommonJS 是在运行时加载模块，因此无法进行静态优化。

## CommonJs

Nodejs所使用的一种标准，是一种运行时模块标准。只有运行到这个表达式的时候，才会确定这个依赖关系。

使用module.exports进行导出，有多个的话使用对象进行导出，单个则直接使用其名称

在nodejs中，为了顺利到处某个模块，会在模块开始执行前初始化一个值：module.exports = {}，然后声明变量： exports = module.exports，所以可以在文件中使用exports进行具名导出

导入的话则使用require进行导入

```js
// 导出语句
module.exports = {
  a: 1,
  b: 2,
  c: 3
}

// 等同于上面的方式
exports.a = 1
exports.b = 2
exports.c = 3

// 导入方式
const obj = require('xxx')
// 使用
console.log(obj.a)
```

由于CJS是一种运行时模块标准，所以导入不必卸载文件顶端，可放置于代码块中

## ESM

ESM是ES6之后的官方模块标准，是编译时模块，在运行前就已经分析确定好了依赖关系，所以相比较于CJS，导入语句必须要写在文件顶端

```js
// 有多个的话可以具名导出
export const a = 1
export const b = 2

// 或默认导出
export default xxx
// 相当于导出了一个对象，{default: xxxx}


// 具名导入
import {a, b, c} from 'xxx'
// 如果只 import "xxx" 则不导入，只运行该模块

// 默认导出的话  可以使用下面的方式导入
import xxx from 'xxxx'
```

上面提到导入语句必须要放在顶端，但如果使用import('xxx') 则可以放在代码块中，因为这是一种动态导入的方式，会返回一个promise，可以通过.then去调用s



**区别**

- require是`异步`导入，import属于`同步`导入
- require是`值拷贝`，实际上获得了一个对该对象的浅拷贝（shallow copy）。这意味着其他模块获得的对象与原始导出的对象是相同的引用，因此可以修改该对象的属性或成员，这将反映在所有导入该模块的地方；
- import指向`内存地址`，导入值会随导出值而变化。ES6模块中，当一个模块导出一个对象，其他模块导入它时，它们获得的是一个对原始对象的只读引用，类似于const变量。这意味着其他模块无法修改导出模块的对象的引用，因为它们获得的引用是只读的，任何尝试修改对象属性的操作都会失败。





在 ESModule 中，如果一个模块导出的是一个引用类型的值，当我们在另一个模块中导入并使用该值时，实际上是创建了一个只读引用，该引用指向了原始模块导出的值。因此，当原始模块中的值发生变化时，导入模块的值也会跟着变化。

在 CommonJS 中，如果一个模块导出的是一个值的拷贝，当我们在另一个模块中导入该值时，实际上是重新复制了一份值，该值和原始模块导出的值没有关系。因此，当原始模块中的值发生变化时，导入模块的值不会受到影响。

例如，假设我们有一个 ESModule 模块和一个 CommonJS 模块：

```javascript
// es.js
let count = 0
export const getCount = () => count
export const increment = () => count++

// cjs.js
let count = 0
module.exports = {
  getCount: () => count,
  increment: () => count++
}
```

然后我们在另一个模块中导入并使用这些模块中导出的值：

```javascript
// main.js
import { getCount as esGetCount, increment as esIncrement } from './es.js'
const cjs = require('./cjs.js')
console.log(esGetCount()) // 输出 0
console.log(cjs.getCount()) // 输出 0
esIncrement()
cjs.increment()
console.log(esGetCount()) // 输出 1
console.log(cjs.getCount()) // 输出 0
```

在上面的示例中，我们分别导入了 es.js 和 cjs.js 模块中导出的 getCount 和 increment 函数，并在 main.js 中使用它们。我们发现，当我们调用 esIncrement 函数和 cjs.increment 函数时，它们都会将 count 的值加 1，但是由于 ESModule 中导出的是一个只读引用，因此调用 esIncrement 函数时，es.js 模块中的 count 值会被加 1，但是调用 cjs.increment 函数时，cjs.js 模块中的 count 值并没有改变，因此 cjs.getCount() 的返回值仍然是 0。



是的，在 CommonJS 中，当我们导入一个模块时，该模块中导出的所有值都会被加载到当前模块的命名空间中。因此，如果一个 CommonJS 模块导出了多个值，那么在导入时也需要分别指定每个值的名称，否则就会将所有导出的值都加载到当前模块的命名空间中。

例如，假设我们有一个 CommonJS 模块如下：

```javascript
// my-module.js
exports.foo = 'foo'
exports.bar = 'bar'
exports.sum = (a, b) => a + b
```

我们可以在另一个模块中导入该模块并使用其中的值：

```javascript
// main.js
const myModule = require('./my-module.js')
console.log(myModule.foo) // 输出 "foo"
console.log(myModule.bar) // 输出 "bar"
console.log(myModule.sum(1, 2)) // 输出 3
```

在上面的示例中，我们通过 `require('./my-module.js')` 导入了 `my-module.js` 模块中导出的所有值，并在 `main.js` 中使用了这些值。因此，当我们调用 `myModule.sum(1, 2)` 时，实际上是调用了 `my-module.js` 中导出的 `sum` 函数。



那么如果导入的时候用了解构呢？是否只导入一个函数？
assistant: 如果在导入 CommonJS 模块时使用了解构，则只会导入指定的属性或方法，而不会导入整个模块的命名空间。

例如，对于上面的 `my-module.js` 模块，我们可以通过以下方式只导入其中的一个函数：

```javascript
// main.js
const { sum } = require('./my-module.js')
console.log(sum(1, 2)) // 输出 3
```

在上面的示例中，我们使用解构方式导入了 `my-module.js` 模块中的 `sum` 方法，而没有导入 `foo` 和 `bar` 属性。因此，当我们调用 `sum` 函数时，实际上是调用了 `my-module.js` 模块中导出的 `sum` 函数，而不会将整个模块的命名空间加载到当前模块的命名空间中。

需要注意的是，对于 ESModule，解构导入时也是只导入指定的属性或方法。例如，我们可以通过以下方式只导入 `obj` 属性和 `sum` 方法：

```javascript
import { obj, sum } from './my-module.js'
console.log(obj.foo) // 抛出错误：obj.foo is not defined
console.log(sum(1, 2)) // 输出 3
```
user: 如何理解下面的代码？
// CommonJS模块
let { stat, exists, readfile } = require('fs')

// 等同于
let _fs = require('fs')
let stat = _fs.stat
let exists = _fs.exists
let readfile = _fs.readfile
assistant: 这段代码展示了在 CommonJS 中如何使用解构导入模块中的属性和方法。

首先，我们使用 `require` 函数加载 Node.js 核心模块 `fs`，并使用解构方式将该模块中的 `stat`、`exists` 和 `readfile` 方法分别导入到当前模块的命名空间中：

```javascript
let { stat, exists, readfile } = require('fs')
```

上述代码等同于下面的代码，通过这种方式我们可以更清楚地看到 `require` 函数返回的模块对象：

```javascript
let _fs = require('fs')
let stat = _fs.stat
let exists = _fs.exists
let readfile = _fs.readfile
```

在 CommonJS 中，模块是单例的，也就是说在一个模块中多次使用 `require` 函数加载同一个模块，返回的都是同一个模块对象。因此，我们可以在当前模块中使用这些导入的方法，例如：

```javascript
stat('/path/to/file', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(stats.isFile())
})
```

上述代码中，我们调用了 `fs.stat` 方法获取指定文件的状态信息，并在回调函数中判断该文件是否是一个普通文件。注意，这里使用的是 `stat` 方法而不是 `fs.stat`，这是因为我们在导入时使用了解构方式，将 `fs.stat` 方法导入到当前模块的命名空间中。