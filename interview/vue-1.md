# Vue框架相关问题 - 基础篇

## 响应式原理

## 双向绑定原理

## 依赖收集的过程

## patch的过程

## nextTick的原理

## watch和computed

## computed是如何收集依赖的

## watchEffect是如何手机依赖的


Vue2 组件通信有哪些方式？
assistant: 在 Vue2 中，组件通信主要有以下几种方式：

1. 父组件向子组件传递数据
    - 通过props进行单向数据传递，即父组件向子组件传递数据，子组件通过props接收父组件传递的数据。

2. 子组件向父组件传递数据
    - 通过自定义事件并派发事件触发父组件的监听方法，即子组件通过 $emit 方法派发自定义事件，父组件通过 v-on 监听子组件派发的事件，并处理事件数据。

3. 兄弟组件之间的通信
    - 通过一个空的 Vue 实例作为中央事件总线（event bus），兄弟组件都可以访问这个实例并通过它来通信。

4. 跨级组件之间的通信
    - 通过provide/inject进行跨级数据传递，即父组件通过 provide 向子孙组件提供数据，子孙组件通过 inject 注入父组件提供的数据。

5. 使用 Vuex 进行组件之间的数据共享
    - Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式，通过集中式的状态管理，可以方便地管理组件之间共享的数据。





## 为什么 Vue3 不用 Object.defineProperty 而用 Proxy？

Vue 3 在设计时放弃了使用 `Object.defineProperty`，而改为使用 ES6 中的 `Proxy` 来实现数据响应式，主要是由于以下原因：

1. `Proxy` 相对于 `Object.defineProperty` 具有更强大的拦截能力，可以拦截到对象的更多操作，如读写属性、删除属性、拦截 `for...in`、`Object.keys()` 等操作。
2. `Proxy` 可以直接监听数组的变化，而不需要特殊处理，而 `Object.defineProperty` 需要对数组进行额外的处理。
3. `Proxy` 在创建时不需要遍历对象属性，而 `Object.defineProperty` 需要对每个属性都进行遍历处理，因此在性能上更有优势。
4. `Proxy` 可以监听动态增加的属性，而 `Object.defineProperty` 需要通过 `Vue.set` 或 `Vue.$set` 方法来实现。

总的来说，使用 `Proxy` 比 `Object.defineProperty` 更加灵活、高效、易用，这也是 Vue 3 放弃使用 `Object.defineProperty` 而使用 `Proxy` 的原因之一。


## 虚拟 DOM 的工作流程大致如下：




- Vue2 相比 Vue3 有什么缺点
  - 1、性能问题：Vue2 采用的是双向数据绑定和脏检查的方式，对于大型应用或复杂组件来说，性能可能会受到影响。
    2、大量代码：Vue2 需要引入大量的代码来支持其功能，使得包的体积较大。
    3、逻辑复用：Vue2 对于逻辑复用的支持不是很好，Vue3 的 compositionApi 很好的解决了这个问题。
    4、TypeScript 支持不佳：Vue2 对于 TypeScript 的支持较弱，需要借助额外的插件来实现类型检查和补充 IntelliSense 等功能。
    5、原生支持数组的响应式，无需重写数组原型方法。




- /deep/ 样式穿透 和原理



vue实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty() 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue追踪依赖，在属性被访问和修改时通知变化。
vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 {{}}），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果。


Vue2 的响应式模式是怎么实现的




vue中的路由模式

history模式

HTML5中的两个API：pushState和replaceState，改变url之后⻚⾯不会重新刷新，也不会带有#号，⻚⾯地址美观，url的改变会触发popState事件，监听该事件也可以实现根据不同的url渲染对应的⻚⾯内容但是因为没有#会导致⽤户在刷新⻚⾯的时候，还会发送请求到服务端，为避免这种情况，需要每次url改变的时候，都将所有的路由重新定位到跟路由下

hash模式
url hash: http://foo.com/#help#后⾯hash值的改变，并不会重新加载⻚⾯，同时hash值的变化会触发hashchange事件，该事件可以监听，可根据不同的哈希值渲染不同的⻚⾯内容



vue 3.0中proxy数据双向绑定

- Proxy 可以直接监听对象⽽⾮属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截⽅法,不限于 apply、ownKeys、deleteProperty、has 等等是Object.defineProperty 不具备的；
- Proxy 返回的是⼀个新对象,我们可以只操作新的对象达到⽬的,⽽Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器⼚商重点持续的性能优化，也就是传说中的新标准的性能红利；



```
## 如何优化webpack配置

缩⼩⽂件查找范围

优化loader
优化resolve.modules
优化resolve.mainFields
优化resolve.alias
优化resolve.extensions
优化module.noPaese


使⽤DllPlugin

基础模块抽离，打包到动态链接库
需要使⽤模块，直接去动态链接库查找


使⽤HappyPack

单线程变多进程


使⽤ParallelUglifyPlugin

开启多进程压缩代码，并⾏执⾏


使⽤CDN加速

静态资源放到CDN服务器上⾯


Tree Shaking

剔除⽆⽤的代码


提取公共代码

防⽌相同资源重复加载
减少⽹络流量及服务器成本


使⽤prepack

编译代码时提前计算结果放到编译后的结果中，⽽不是在代码运⾏才求值
```


## 虚拟dom是什么，和真实dom的区别

## diff算法

## 首屏加载慢如何解决

## v3和v2的区别

## 和keep-alive相关的生命周期

## watch和computed的区别

## vuex的工作流程

## 组件之间的通信

- vue 组件通信 
  - provide/inject：通过provide将数据传递给所有子组件，子组件通过inject获取数据。


- vue-router的histroy模式和hash模式
- 插槽


- 双向绑定
- 高阶组件
- 为什么vue3要使用组合式API？