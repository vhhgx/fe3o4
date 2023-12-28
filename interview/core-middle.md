# JS 面试问答 - 中级篇

## 如何开 JS 的多线程

使用 new workder 来实例化一个新的 worker 对象，参数是新线程中执行的代码文件。可以通过 postMessage 向新线程发送消息。然后通过一个 onmessage 事件来接受 worker 线程的响应

可以使用 terminate() 来进行关闭线程实例

注意事项：

- 线程隔离：Web Workers 运行在与主线程隔离的环境中，它们无法直接访问主线程的全局变量或 DOM。
- 数据传输：主线程和 Worker 之间的数据传输是通过结构化克隆算法完成的，意味着传输的是数据的拷贝（类似于深拷贝），而不是共享数据。
- 错误处理：应在 Worker 内部和主线程中都进行适当的错误处理。

## JS 自身的性能优化

**UI 层面**

- 使用事件委托
- 图片懒加载
- 减少重绘和回流
- 使用 requestAnimationFrame

**JS 层面**

- 避免全局变量
- 优化循环
- 优化网络请求
- 频繁查找的场景中使用对象或 map 结构
- 避免闭包和定时器造成的内存泄漏
- 对一些函数的处理结果进行缓存
- 开启多线程

## requestAnimationFrame

在重绘之前调用指定函数的 api，比传统的 setTimeout 和 setInterval 更适合创建平滑的动画效果，因为它能够更智能地与浏览器的绘制过程同步。

调用 raf 传一个回调函数，浏览器会把这个回调函数排队，在下次重绘前调用它。

优势
性能优化：requestAnimationFrame 会尽量匹配浏览器的刷新率，减少布局抖动和无效渲染
节省资源：当页面或标签不可见时，requestAnimationFrame 会暂停，从而减少 CPU 和 GPU 的使用，节省资源
更平滑的动画：它能确保在最适合的时间更新动画，从而使动画看起来更加平滑

## 有什么方式可以控制最大并发量

TODO 关联到手写代码

```js
function withConcurrencyLimit(tasks, limit) {
  let active = 0;
  let results = [];

  // 递归函数来处理任务
  function next() {
    if (active >= limit || tasks.length === 0) {
      return Promise.resolve();
    }

    active++;
    let task = tasks.shift();
    return task().then(result => {
      active--;
      results.push(result);
      return next();
    });
  }

  // 启动初始批次任务
  let promises = [];
  for (let i = 0; i < limit && i < tasks.length; i++) {
    promises.push(next());
  }

  return Promise.all(promises).then(() => results);
}

// 使用
let tasks = [task1, task2, task3, ...]; // 这些任务应该是函数返回Promise
withConcurrencyLimit(tasks, 3).then(results => {
  console.log(results); // 处理结果
});

```

## 如果任务有优先级 如何对高优先级的任务进行调度，并先执行高优先级的任务

<!-- 实现优先队列，给每个任务添加一个优先级属性，创建这样一个队列。高优先级 -->

```js
class PriorityQueue {
  constructor() {
    this.tasks = []
  }

  add(task, priority) {
    this.tasks.push({ task, priority })
    this.tasks.sort((a, b) => b.priority - a.priority) // 高优先级排在前面
  }

  next() {
    return this.tasks.shift().task
  }

  isEmpty() {
    return this.tasks.length === 0
  }
}

async function withPriorityAndConcurrencyLimit(limit, queue) {
  let active = 0
  let results = []

  async function next() {
    if (active >= limit || queue.isEmpty()) {
      return
    }

    active++
    let task = queue.next()
    try {
      let result = await task()
      results.push(result)
    } finally {
      active--
      await next()
    }
  }

  let promises = []
  for (let i = 0; i < limit && !queue.isEmpty(); i++) {
    promises.push(next())
  }

  await Promise.all(promises)
  return results
}

// 使用
let queue = new PriorityQueue()
queue.add(() => fetchData('url1'), 1) // 优先级为1
queue.add(() => fetchData('url2'), 3) // 优先级为3
queue.add(() => fetchData('url3'), 2) // 优先级为2

withPriorityAndConcurrencyLimit(2, queue).then((results) => {
  console.log(results)
})

// 在这个示例中，我们创建了一个PriorityQueue类来管理带有优先级的任务。withPriorityAndConcurrencyLimit函数用于处理队列中的任务，同时遵守最大并发数的限制。任务根据优先级排序，优先级高的任务会先被执行。

// 注意事项
// 任务排序：在任务添加到队列时，根据优先级对任务进行排序。优先级高的任务排在队列的前面。
// 并发控制：即使优先级高的任务被优先执行，也需要确保不会超过设定的最大并发数。
// 动态调整：在实际应用中，你可能需要根据不同情况动态调整任务的优先级。
```

## setTimeout 为什么会造成内存泄露？如何防止 setTimeout 内存泄露？清除定时器为什么就不会有内存泄露？

因为会形成闭包，如果这些变量较大或者包含对 dom 的引用。并且这些对象再 settimeout 回调之前不再需要，也无法被垃圾回收

如何防止：

- 清除定时器
- 避免在定时器中保留不必要的引用

## 延迟加载 JS 的方式有哪些

- 在 script 标签中使用 defer，脚本会延迟执行，直到页面解析完毕
- 使用 async，js 一旦加载完毕就立即执行
- 或者动态创建 script 标签
- 利用 Intersection Observer API 来检测元素是否进入视口，然后动态加载相关脚本

```js
let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 加载脚本
      let script = document.createElement('script')
      script.src = 'example.js'
      document.body.appendChild(script)
    }
  })
})

observer.observe(document.querySelector('#someElement'))
```

## 怎么实现无痕刷新 token

## 发布订阅模式和观察者模式有什么区别

**发布订阅模式**

需要三个主体：发布者、订阅者和事件通道。发布者将消息发布到事件通道，而不是直接发送给订阅者。订阅者订阅这个通道，然后可以收到消息

在事件里存一些需要在特定条件下才会触发的函数，通过发布函数，在合适的时机触发这些回调

```js
class PubSub {
  constructor() {
    // 订阅者 用于储存不同事件的订阅者，也就是回调函数
    // 事件名作为键，值为数组，该数组储存了所有订阅了该事件的回调函数
    this.subscribers = {}
  }
  // 用于订阅某个特定的事件，接受两个参数
  // 事件名称和回调函数
  subscribe(event, callback) {
    // 检查这里的对象中是否有了给定的键
    // 如果没有 则说明第一次订阅，把该事件添加进去
    if (!this.subscribers[event]) {
      this.subscribers[event] = []
    }
    // 订阅过，直接把回调push进相应的数组
    this.subscribers[event].push(callback)
  }

  // 用于发布一个事件
  // 也是接受两个参数，事件名和传递给回调函数的数据
  publish(event, data) {
    // 检查是否有订阅了该事件的订阅者
    if (this.subscribers[event]) {
      // 有的话就遍历 然后执行
      this.subscribers[event].forEach((callback) => callback(data))
    }
  }
}

// 使用
const pubSub = new PubSub()
pubSub.subscribe('event1', (data) => console.log(data))
pubSub.publish('event1', 'Hello World!')
```

**观察者模式**

在观察者模式中，观察者需要知道观察的对象，并且直接从被观察的对象接受消息。所以观察者需要实现一个特定的接口，被观察的对象直接调用这些接口。观察者和被观察者之间，存在着比较强的依赖关系。消息是直接通从 subject 传递给观察者的，通常是同步的

```js
// 管理所有观察者，并在状态变化时进行通知
class Subject {
  // 构造器用于创建一个观察者数组
  // 储存了所有订阅了Subject的观察者
  constructor() {
    this.observers = []
  }

  // 添加新的观察者到观察者数组中
  subscribe(observer) {
    this.observers.push(observer)
  }

  // 通知，当Subject的状态发生变化时，通知所有观察者
  // 在上面存入的数组中，去挨个调用观察者的update函数
  notify(data) {
    this.observers.forEach((observer) => observer.update(data))
  }
}

class Observer {
  update(data) {
    console.log(data)
  }
}

// 使用
const subject = new Subject()
const observer = new Observer()
subject.subscribe(observer)
subject.notify('Hello World!')
```

在 vue2 中，观察者模式用于实现其响应式系统，每个组件的示例都可以视为一个观察者，当数据对象的属性发生变化时，组件会重新渲染

## 常见的设计模式

### 单例模式

singleton pattern

保证⼀个类只有⼀个实例，并提供⼀个访问它的全局访问点（调⽤⼀个类，任何时候返回的都是同⼀个实例）

实现⽅法：使⽤⼀个变量来标志当前是否已经为某个类创建过对象，如果创建了，则在下⼀次获取该类的实例时，直接返回之前创建的对象，否则就创建⼀个对象。

```js
class Singleton {
  constructor(name) {
    this.name = name
    this.instance = null
  }
  getName() {
    alert(this.name)
  }
  static getInstance(name) {
    if (!this.instance) {
      this.instance = new Singleton(name)
    }
    return this.instance
  }
}
```

### 工厂模式

⼯⼚模式定义⼀个⽤于创建对象的接⼝，这个接⼝由⼦类决定实例化哪⼀个类。该模式使⼀个类的实例化延迟到了⼦类。⽽⼦类可以重写接⼝⽅法以便创建的时候指定⾃⼰的对象类型。

简单说：假如我们想在⽹⻚⾯⾥插⼊⼀些元素，⽽这些元素类型不固定，可能是图⽚、链接、⽂本，根据⼯⼚模式的定义，在⼯⼚模式下，⼯⼚函数只需接受我们要创建的元素的类型，其他的⼯⼚函数帮我们处理。

```js
// ⽂本⼯⼚
class Text {
  constructor(text) {
    this.text = text
  }
  insert(where) {
    const txt = document.createTextNode(this.text)
    where.appendChild(txt)
  }
}
// 链接⼯⼚
class Link {
  constructor(url) {
    this.url = url
  }
  insert(where) {
    const link = document.createElement('a')
    link.href = this.url
    link.appendChild(document.createTextNode(this.url))
    where.appendChild(link)
  }
}
// 图⽚⼯⼚
class Image {
  constructor(url) {
    this.url = url
  }
  insert(where) {
    const img = document.createElement('img')
    img.src = this.url
    where.appendChild(img)
  }
}
// DOM⼯⼚
class DomFactory {
  constructor(type) {
    return new (this[type]())()
  }
  // 各流⽔线
  link() {
    return Link
  }
  text() {
    return Text
  }
  image() {
    return Image
  }
}
// 创建⼯⼚
const linkFactory = new DomFactory('link')
const textFactory = new DomFactory('text')

linkFactory.url = 'https://surmon.me'
linkFactory.insert(document.body)

textFactory.text = 'HI! I am surmon.'
textFactory.insert(document.body)
```

## 数组和链表的区别

数组：

内存分配：数组在内存中占用连续空间。
访问速度：提供快速的随机访问，时间复杂度为 O(1)。
插入/删除：在数组中间或开头插入/删除元素较慢，因为可能需要移动元素以保持连续性。
适用场景：适合访问密集型操作，但不适合频繁的插入/删除操作。

链表：

内存分配：链表的元素在内存中可以是非连续的，每个元素节点包含数据和指向下一个节点的引用。
访问速度：访问元素需要从头开始遍历，时间复杂度为 O(n)。
插入/删除：插入和删除操作通常更快，因为不需要移动其他元素，只需更改指针即可。
适用场景：适合插入和删除操作频繁的场景。

## 文件分片上传

原理：文件分片上传是将大文件切割成小块，然后逐块上传。这样做可以提高大文件上传的效率，支持断点续传，减少因网络问题导致的上传失败风险。

实现步骤：

分割文件：使用 Blob.slice()方法将文件切割成多个小块。
上传每个片段：逐个上传文件的每个片段。
服务器端重组：上传完成后，在服务器端将这些片段重组成原始文件。
示例代码：

假设我们有一个函数 uploadChunk(chunk)用于上传单个文件块：

```js
function uploadFile(file) {
  const CHUNK_SIZE = 1024 * 1024 // 1MB
  let start = 0

  while (start < file.size) {
    let chunk = file.slice(start, start + CHUNK_SIZE)
    uploadChunk(chunk) // 上传文件块
    start += CHUNK_SIZE
  }
}
```

TODO 这里要看一下渡一的视频

## 深度优先遍历和广度优先遍历的区别

深度优先遍历（DFS）和广度优先遍历（BFS）是两种常用的遍历树或图结构的算法，它们的主要区别在于遍历顺序：

深度优先遍历（DFS）:

优先沿着树的深度遍历节点，即先访问一个节点的子节点，直到达到叶节点，然后回溯。
在图中，它尝试尽可能深地搜索图的分支。
通常使用递归或栈实现。
广度优先遍历（BFS）:

一层层地遍历树的节点，即先访问距离根节点最近的节点。
在图中，它先访问起始节点的所有邻接点，然后再遍历这些邻接点的邻接点，以此类推。
通常使用队列实现。

## 前端权限的管理方案

- 菜单：前端在用户登录后获取相应的菜单数据
- 路由：使用路由守卫
- 元素：v-if 等，但不太推荐，有没有别的方法
- 前后端同样的权限控制，防止未授权用户通过直接访问 api 来绕过权限
- jwt，发送请求的时候带上用户信息。后端进行相应的校验
