# 语法相关

## 基础语法

### 数据类型

- 原始类型：Null、Undefined、Boolean、String、Number、Symbol、BigInt
- 引用类型：Object、Array

定义BigInt，可以使用BigInt()函数也可以直接在大型整数后加`n`，BigInt不能与Number进行比较

原始类型储存在栈内存，引用数据类型同时存 储在栈和堆中。在栈中储存`键`和`地址`。堆中储存`数据`。需要时通过栈中的地址进行寻找

### 隐式转换

avaScript的隐式类型转换是指在执行操作时，如果操作数类型不符合预期，JavaScript会自动转换数据类型。这个概念通常属于“基础语法和类型”类别，因为它直接关联到JavaScript的基本类型和运算符的使用。

在JS中，隐式转换最常见的情况包括：

字符串拼接：当一个操作数是字符串时，其他操作数会被转换成字符串。
算术运算：进行算术运算时，非数字类型的值会被转换为数字。
逻辑运算：在逻辑操作如if语句中，非布尔值会被转换为布尔值。
理解这种隐式转换对编写可预测和可靠的JavaScript代码非常重要，因为这种转换有时可能导致意料之外的结果。掌握它有助于更好地理解和使用JavaScript的基础语法和类型系统。


### 数据类型转换

### 强制类型转换

Number(): 
	true 和 false 转换为1和0
	数字返回自身
	null返回0
	undefined返回NaN
	字符串:若包含数字，则将其转换为十进制
				包含有效浮点格式，转换为浮点数值
				空字符串返回0
				不是以上格式，则返回NaN
	Symbol抛出错误

Boolean()
	除了undefined、null、false、''、0、NaN转换为false，其他都是true

parseInt()
parseFloat()
toString()
String()


### 隐式类型转换

逻辑运算符（&& || !）
运算符（+ - * /）
关系操作符（> < <= >=）
相等运算符（==）
if/while条件

==

1. 类型相同，无需类型转换
2. 如果其中一个操作值是null或undefined，那么另一个操作符必须为null或undefined，才会返回true。否则返回false
3. 如果其中一个为Symbol类型，则返回false
4. 两个操作值如果都为string或number类型，那么会将字符串转换为number
5. 如果一个操作值是boolean，则转换为number

+

1. 字符串拼接或数字相加，两边都是字符串则拼接。有一边操作符为字符串，一边为数字，则进行隐式转换
2. 其中一个为字符串，另一个是undefined、null或Boolean，则调用toString() 方法进行字符串拼接
	2.1. 如果是纯对象、数组、正则等，则默认调用对象的转换方法会存在优先级，然后再进行拼接
3. 如果其中有一个是数字，另外一个是undefined、null、Boolean或数字则会将其转换为数字进行加法运算

- `-`、`/`、`*`、`%`：字符串转数字，再进行计算。如果非数字型字符串，则返回`NaN`
- `+`：比较复杂，需要分情况
  - `数字`+`字符串`，拼接成字符串
  - `数字`+`数字`，直接进行计算
  - `数字`+`undefined`，返回`NaN`
  - `数字`+`Boolean/null`，`true`转换为`1`，`false/null`转换为`0`


### 类型判断

- 判断数组：Array.isArray()
- 判断原始类型：typeof
- 判断能否在原型链上找到：instanceof
- 判断所有信息：Object.prototype.toString.call()

手写类型判断函数

```js
let class2type = {}
let types = ['Array', 'Date', 'RegExp', 'Object', 'Error']
types.forEach(e => class2type[ '[object ' + e + ']' ] = e.toLowerCase()) 

function type(obj) {
  if (obj == null) return String(obj)
  return typeof obj === 'object' ? class2type[ Object.prototype.toString.call(obj) ] || 'object' : typeof obj
}
```

### 变量定义

var会变量提升，const和let不会。let是块级作用域，不能跨块进行访问。具体查看 [作用域](/core/base/scope)

这里会问作用域相关内容


### 扩展运算符与解构赋值

扩展运算符：取出参数对象中的所有可遍历属性，拷贝到当前对象之中。同名会被覆盖。拷贝对象是拷贝的地址

```js
let bar = { a: 1, b: 2 }
// { a: 1, b: 2 }
let baz = { ...bar }
```

解构赋值：没啥好说的，看代码

```js
let { foo, bar } = { foo: 'aaa', bar: 'bbb' }
let [a, b, c] = [1, 2, 3]
let [a, [[b], c]] = [1, [[2], 3]]
let [a = 1, b = 2] = [undefined, 3]
// a = 10 b = 20 rest = {c: 30, d: 40}
let {a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40}
// 还可以设置默认值，结果就是 a = 3, b = 5
let {a = 10, b = 5} = {a: 3}
```



## 一些经典问题

### TAG 0.1+0.2 !== 0.3

JS采用了IEEE 754 标准定义的 64 位浮点格式表⽰数字，所以所有数字都是浮点数。所以对于一些小数值无法精确表示。而0.1和0.2都是无限循环小数，所以js使用近似值来进行表示

所以js将其转换为二进制后在进行位相加，转换成十进制后就变成了0.30000000000000004

**解决方法**

```js
// 原生
parseFloat((0.1 + 0.2).toFixed(10))

// 更精确
function accAdd (arg1, arg2) {
  var r1, r2, m
  try{
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try{
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1,r2))
  return (parseInt(arg1*m, 10) + parseInt(arg2*m, 10)) / m
}
```


## 会改变自身值的方法

- push：向末尾添加元素，返回添加后的length
- pop：删除数组最后一个元素，返回被删除的元素
- reverse：反转数组
- shift：删除数组的第一个元素，返回被删除的元素
- unshift：向数组开头添加元素（改变原数组） 返回添加后数组的length
- sort：数组排序
- splice：
- copyWithin [es6]：数组的指定位置复制
- fill <Badge type="tip" text="ES6" />：数组的填充


## 不改变自身值的方法

- Array.from()：将数组对象转换为数组 不改变原对象 返回新数组
- Array.isArray()：用于确定传递的值是否是一个 Array
- concat：连接合并多个数组，返回新数组
- join：将数组转换为字符串
- slice：拷贝数组元素
- toString：方法可把数组转换为字符串，并返回结果
- toLocateString
- indexOf：查找数组中某元素的第一个索引值，没有就返回-1
- lastIndexOf：逆向查找指定元素在数组中的第一个位置
- includes [es7]：查找数组是否包含某个元素


## 遍历方法

- forEach：按升序依次遍历数组中的值
- every：检测数组中的元素是否全部满足条件
- some：检测数组中是否存在满足条件的元素
- filter：过滤原数组，返回新数组
- map：对数组中的每一个元素都进行处理，返回新的数组
- reduce：数组的累加器，合并成为一个值
- reduceRight
- find：根据条件找到数组成员
- fineIndex
- keys：遍历键名
- values：遍历键值
- entries：遍历键值对



### TODO 数据四舍五入和千位符