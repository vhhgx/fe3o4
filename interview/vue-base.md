# 简单问题

## Vue2

### 一句话快问快答

| 问题                                   | 答案                                                                                              |
| :------------------------------------- | :------------------------------------------------------------------------------------------------ |
| props、data、methods 的优先级          | props > data > methods                                                                            |
| 父组件向子组件传递数据                 | props                                                                                             |
| 子组件向父组件传递事件                 | $on、$emit                                                                                        |
| 需要主动销毁 addEventListeners 吗      | 需要，否则会造成内存泄漏                                                                          |
| vue 组件的销毁时机                     | 页面关闭、路由跳转、v-if 和改变 key 值                                                            |
| vue 兼容的 ie 版本                     | ie8 及以下版本，因为`Object.defineProperty`不支持 ie8-                                            |
| 组件和插件的区别                       | `组件`是用来构成 App 的业务模块，目标是 app.vue。`插件`是用来增强 Vue 的功能模块，目标是 Vue 本身 |
| style 和 script 标签是必需的吗         | 都不是必需的，`script`必须要写标签和`export default {}`                                           |
| vue-loader 是什么                      | 一个 vue 的 wp 加载器，提取`vue`文件中`template`、`script`和`style`                               |
| v-on 可以绑定多个方法吗                | 可以，但一个指令只能绑定一个方法。可以单个绑定或使用对象                                          |
| 单个绑定                               | `@input="onInput" @focus="onFocus" @blur="onBlur"`                                                |
| 使用对象                               | `<input type="text" v-on="{ input:onInput, focus:onFocus, blur:onBlur }">`                        |
| watch、methods 中可使用箭头函数吗      | 不可以，由于箭头函数默认绑定父级作用域的上下文，所以不会绑定`vue`实例，`this`为`undefined`        |
| 使用 this 应该注意那些问题             | 使用匿名函数会出现 this 指针改变 在 methods、data、watch 和生命周期的钩子函数内避免使用箭头函数   |
| 如何在 vue 项目中配置图标              | 在`public`中放入图标，在 index.html 写入`<link rel="icon" href="<%= BASE_URL %>favicon.ico">`     |
| 如何保留 html 中的注释节点             | `<template comments></template>`                                                                  |
| data、methods、props 的 key 可重复吗   | 不可以，因为在`initState`方法内会把他们都挂载 vm 实例上，有重名就会报错                           |
| e.target 和 e.currentTarget 有什么区别 | currentTarget 为事件绑定的元素，而 target 为鼠标触发的元素（始终指向事件发生时的元素）            |
| 事件绑定                               | 原生事件：`addEventListener`；组件：`$on`                                                         |
| >>>操作符失效如何操作                  | 可以使用`/deep/`或`::v-deep`，两者都是`>>>`的别名                                                 |
| 如何创建一个组件                       | Vue.component 或者在 单文件组件的 template 中进行定义                                             |
| keep-alive 组件的作用                  | 用于在切换页面时保留当前页面或组件的状态                                                          |
| 事件处理方法                           | v-on 指令，可以简写为@，对一些事件进行绑定，例如点击事件，v-on:click 或者@click 等                |

### Vue 2 的生命周期钩子

vue 实例从创建到销毁，也就是从开始创建、初始化数据、编译模板、挂载 Dom->渲染、更新->渲染、卸载的过程。分为`创建`、`挂载`、`更新`、`销毁`四个过程

创建

**1. beforeCreate** <br>
在`new Vue()`触发后的第一个钩子，当前阶段 data、methods、computed 及 watch 都不能被访问。只添加了一些默认事件

**2. created** <br>
`data`和`methods`初始化完毕，已经完成了数据观测。可以在该声明周期调用`methods`的方法或操作`data`中的数据。但无法操作 dom，有需要可以使用`vm.$nextTick`方法

挂载

**3. beforeMount** <br>
`template`已经编译成为了`render`函数，`虚拟dom`已经创建完成。`$el`和`data`都初始化完毕，但还没挂载到页面中

**4. mounted** <br>
`Vue`实例初始化完成。`真实dom`已挂载，数据完成了双向绑定，可以在该生命周期操作 dom 节点，`vm.$el`可以调用

更新

**5. beforeUpdate** <br>
响应式数据进行更新，在`虚拟dom`重新渲染之前被触发，可以在该阶段更改数据。不会重新渲染

**6. updated** <br>
`data`和页面显示的数据同步完成，需要避免在此阶段更改数据。有可能会造成无限循环的更新

销毁

**7. beforeDestroy** <br>
`Vue`实例从运行阶段进入到了销毁阶段，该周期所有的`data`、`methods`、`指令`和`过滤器`等都是可用状态，还没有真正被销毁。要在该阶段销毁定时器和绑定事件

**8. destroyed** <br>
组件已经被销毁了，数据绑定被卸除，监听移出。子实例也被销毁

### watch 和 computed 的区别

**computed**

1. 依靠依赖项的变化对自己做出改变，从而动态返回内容
2. 只能监听简单对象的变化
3. 拥有缓存

`computed`本质是一个拥有缓存的 watcher，依赖属性发生变化就会重新计算，如果不变化就直接从属性中获取。适用于计算比较消耗性能的场景。引用值不能在`data`中声明过。

**watch**

1. 监听是一个过程，通过监听属性的变化，触发一个回调。所以一般用于异步中
2. 可以深度监听复杂对象的变化
3. 没有缓存

`watch`没有缓存性，更多是用于观察。可以监听某些数据，然后执行一些回调。如果需要深度监听，可以使用`deep: true`选项监听对象中的每一项，但会带来性能问题

但`watch`第一次绑定时是不会执行的，只有当监听的项目发生改变时才会进行监听。如果一开始就要进行监听，可以添加`immediate: true`属性。把原函数写在`handler`中。`deep: true`属性可以更深入的监听对象中属性的变化。但会造成较大的性能开销。监听的属性必须在 data 中声明过

**总结**

需要动态值，就使用`computed`属性。需要知道值的改变后执行业务逻辑，就是用`watch`方法

### 组件之间的通信

1. 父向子：props 进行单向数据传递，还可以借助 attr 透传属性，把父组件中的 class 和
2. 子向父：通过自定义事件并派发事件触发父组件的监听方法，即子组件通过 $emit 方法派发自定义事件，父组件通过 v-on 监听子组件派发的事件，并处理事件数据

```js
// 子组件
this.$emit('func', '参数')

// 父组件
<xxx @func="事件处理函数" />
```

3. 兄弟组件：通过一个空的 Vue 实例作为中央事件总线（event bus），兄弟组件都可以访问这个实例并通过它来通信
4. 跨级组件：通过 provide/inject 进行跨级数据传递，即父组件通过 provide 向子孙组件提供数据，子孙组件通过 inject 注入父组件提供的数据

### MVVM 是什么

### 双向数据绑定 / v-model

通过 v-model 指令，可以实现视图（html）和逻辑（js）之间的绑定。实际上就是一个语法糖，通过绑定一个 value 属性和一个 input 事件来实现，表单元素的值发生变化的时候，input 事件会把最新的值传递给 value

```js
<input type="text" :value="msg" @input="setMsg" />
<h1>{{ msg }}</h1>

methods: {        
  setMsg (e) { this.msg = e.target.value }
}
```

### 什么是插槽，如何使用

在组件中通过 slot 标签来规定需要使用插槽的地方，可以使用 name 来设定插槽名称。在需要使用插槽的地方通过 template 来进行插入，并且用#加名称的方式使用具名插槽

### 如何在 Vue 中使用样式绑定？

```html
<xxx :style="{fontSize: size'px'}" :class="{xxx: true}" />
<xxx :style="{fontSize: size'px'}" :class="`xx-${xxx}`" />
```

### 如何理解 vue 的单向数据流

数据的单向流动，父只能通过 props 来向子传递数据，而不能反向更改。v-model 也是，只是对输入框中的数据进行同步的更新

这样可以避免数据的意外修改，使代码可读性更强

### 什么是 Vue 实例的 `$emit` 方法？

用于触发父组件中所绑定的事件，就是订阅发布模式中的发布

### 如何在 Vue 中使用路由参数

通过`$route.params`来进行访问

### Vue 的 `v-for` 中的 `key` 属性有什么作用

用在虚拟 dom 中，给 diff 函数来标识唯一的 vnode，提高渲染性能

### 如何在 Vue 2 中使用 Vue Router 进行路由管理

- 在文件中引入 router 使用的包
- 然后建立路由表数组，元素是对象，对象里面的属性有路由和该路由使用的组件（页面）
- 创建路由实例，添加路由表属性
- 导出该实例
- 在 mainjs 中引用
- 在 app.vue 中使用`<router-view></router-view>`

### Vue 2 中的动态组件是什么

`<component :is ></component>`

### Vue 2 中的过滤器如何使用

用管道符，来对一些数据进行过滤，返回符合方法的字符串。可以使用 Vue.filter 来定义全局过滤器，或在单文件组件中的 filter 对象中进行定义

### Mixins 是什么，如何使用

混入，可以创建一些可复用的逻辑，通过 mixins 属性来添加到需要使用这些逻辑的文件中

```js
// 定义，正常的函数定义然后导出
//创建一个mixin
var myMixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc',
    }
  },
  methods: {
    showMessage: function () {
      alert(this.message)
    },
  },
}

// 使用，在需要的文件中进行引入，然后使用mixin属性
mixins: [myMixin]
```

mixin 的钩子在组件的钩子前调用，如果有命名冲突，组件的优先级更高。可以使用 Vue.mixin 来注册全局混入

### 指令是什么，如何自定义指令

一个对 dom 进行操作的特殊语法，使用 v-开头，比如 v-if 可以根据条件来判断隐藏或显示

```js
Vue.directive('指令名', {
  inserted(el) {
    // 可以对 el 标签，扩展额外功能
    el.focus()
  },
})
```

可以在 main.js 中全局注册，或者在单文件组件中，通过 directive 对象来进行注册。inserted：被绑定元素插入父节点时调用的钩子函数，el 则是使用指令的 dom 元素

### 如何处理应用中的错误和异常

- try-catch
- app.config.errorHandler

可以使用一个 errorHandler 来定义一个错误，然后挂载在原型上 （globalProperties）

### 如何在 Vue 2 中实现过渡和动画

使用 transition 标签

进入：.v-enter 始状态、.v-enter-to 末状态、.v-enter-active 进入动画（Vue2）
离开：.v-leave 始状态、.v-leave-to 末状态、.v-leave-active 离开动画（Vue2）
进入：.v-enter-from 始状态、.v-enter-to 末状态、.v-enter-active 进入动画（Vue3）
离开：.v-leave-from 始状态、.v-leave-to 末状态、.v-leave-active 离开动画（Vue3）

```html
<template>
  <div>
    <button @click="bol = !bol">隐藏/显示</button>
    <!-- Vue 的内置动画标签 transition -->
    <transition>
      <!-- 只能包含 1 个元素 -->
      <h1 v-show="bol">组件动画效果</h1>
      <!-- 需要设置 v-show / v-if 属性控制元素的显示 -->
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return { bol: true }
    },
  }
</script>

<style>
  /* 进入动画 */
  .v-enter-active {
    animation: move 1s;
  }

  /* 离开动画 */
  .v-leave-active {
    animation: move 1s reverse;
  }

  /* 如果设置了名称，则类名也需要带有名称 */
  /* 类名要对应回 name 的属性值 */
  .moveCartoon-enter-active {
    animation: move 1s;
  }
  .moveCartoon-leave-active {
    animation: move 1s reverse;
  }

  @keyframes move {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translate(0);
    }
  }
</style>
```

### $nextTick

`Vue.nextTick` 是 Vue.js 的一个方法，用于在 DOM 更新后执行回调函数。

因为 Vue.js 在更新 DOM 后并不会立即更新组件的数据，而是会将更新添加到一个队列中，在下一个“tick”（事件循环）中更新。这种机制被称为“异步更新队列”

实现原理是基于 JavaScript 中的事件循环机制，它会先将回调函数放到微任务队列中，等待本次事件循环结束后执行

nextTick 的核心是利用了如 Promise、MutationObserver、setImmediate、setTimeout 的原生 JavaScript 方法来模拟对应的微/宏任务的实现


确保在同一事件循环中的多次数据变更只触发一次视图更新。


### vue 路由守卫

### 为什么使用路由懒加载

`const Bar = () => import('./Bar.vue')`

使用上面的这种 import 语句，webpack 会自动的生成相应的 chunk，哪怕没有使用 webpack 的 webpackChunkName 语句，这样每个使用 import 导入的组件都会生成单独的 js，并且只有在路由被访问的时候才进行加载，提高了页面的访问速度

路由懒加载的主要目的是优化页面加载性能。当页面较大时，使用路由懒加载可以分割资源，根据路由动态加载所需的组件，而不是一次性加载所有组件，这样可以加快初始页面加载速度，提高用户体验

### 父子组件生命周期调用顺序（简单）

渲染顺序：先父后子，完成顺序：先子后父

更新顺序：父更新导致子更新，子更新完成后父

销毁顺序：先父后子，完成顺序：先子后父

### vue3 的路由懒加载什么样子

asyncComponent 好像是这个

### VueRouter 的路由模式有哪几种

hash 模式和 history 模式，hash 模式使用 URL 的 hash（#）来模拟一个完整的 URL，当 URL 有变化时，页面不会重新加载，而是通过 hashchange 事件监听到 URL 的变化，然后通过 hash 来实现视图的更新；history 模式使用 HTML5 的 History API 来进行 URL 跳转，通过 pushState 和 replaceState 方法可以动态改变浏览器的 URL，而不需要刷新页面

能说下 vue-router 中常用的 hash 和 history 路由模式实现原理吗？
（1）hash 模式的实现原理
早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：
复制代码https://www.word.com#search
hash 路由模式的实现主要是基于下面几个特性：

URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制 hash 的切换；
可以通过  a  标签，并设置  href  属性，当用户点击这个标签后，URL  的 hash 值会发生改变；或者使用  JavaScript 来对  loaction.hash  进行赋值，改变 URL 的 hash 值；
我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。

（2）history 模式的实现原理
HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：
复制代码 window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
history 路由模式的实现主要基于存在下面几个特性：

pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
我们可以使用 popstate 事件来监听 url 的变化，从而对页面进行跳转（渲染）；
history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。

### vue 的性能优化

- 优化首屏加载
- 路由懒加载
- 使用 compression-webpack-plugin 组件来开启 gzip 压缩
- 使用 cdn
- 代码优化
  - if 和 show
  - 计算属性和监听属性
- 避免内存泄漏

- 对象层级不要过深，否则性能就会差
- 不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）
- v-if 和 v-show 区分使用场景
- computed 和 watch 区分使用场景
- v-for 遍历必须加 key，key 最好是 id 值，且避免同时使用 v-if
- 大数据列表和表格性能优化-虚拟列表/虚拟表格
- 防止内部泄漏，组件销毁后把全局变量和事件销毁
- 图片懒加载
- 路由懒加载
- 第三方插件的按需引入
- 适当采用 keep-alive 缓存组件
- 防抖、节流运用
- 服务端渲染 SSR or 预渲染

代码层面的优化

v-if 和 v-show 区分使用场景
computed 和 watch 区分使用场景
v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
长列表性能优化
事件的销毁
图片资源懒加载
路由懒加载
第三方插件的按需引入
优化无限列表性能
服务端渲染 SSR or 预渲染

（2）Webpack 层面的优化

Webpack 对图片进行压缩
减少 ES6 转为 ES5 的冗余代码
提取公共代码
模板预编译
提取组件的 CSS
优化 SourceMap
构建结果输出分析
Vue 项目的编译优化

（3）基础的 Web 技术的优化

开启 gzip 压缩

浏览器缓存

CDN 的使用

使用 Chrome Performance 查找性能瓶颈

### 何时需要是用 beforeDestory

解除自定义事件 event.$off,否则容易造成内存泄露
清除定时器
解绑自定义的 DOM 事件（addEventLisenner），如 window scroll 等

### vue-router 的流程是什么

完整的导航解析流程:

导航被触发。
在失活的组件里调用 beforeRouteLeave 守卫。
调用全局的 beforeEach 守卫。
在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
在路由配置里调用 beforeEnter。
解析异步路由组件。
在被激活的组件里调用 beforeRouteEnter。
调用全局的 beforeResolve 守卫 (2.5+)。
导航被确认。
调用全局的 afterEach 钩子。
触发 DOM 更新。
调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 写过自定义指令吗 原理是什么

指令本质上是装饰器，是 vue 对 HTML 元素的扩展，给 HTML 元素增加自定义功能。vue 编译 DOM 时，会找到指令对象，执行指令的相关方法。
自定义指令有五个生命周期（也叫钩子函数），分别是 bind、inserted、update、componentUpdated、unbind

1. bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
2. inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
3. update：被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。
4. componentUpdated：被绑定元素所在模板完成一次更新周期时调用。
5. unbind：只调用一次，指令与元素解绑时调用。

原理 1.在生成 ast 语法树时，遇到指令会给当前元素添加 directives 属性 2.通过 genDirectives 生成指令代码 3.在 patch 前将指令的钩子提取到 cbs 中,在 patch 过程中调用对应的钩子 4.当执行指令对应钩子函数时，调用对应指令定义的方法

### 整个的使用的流程或者说的打包流程是什么

### 22. 说一下 Vue complier 的实现原理是什么样的？

在使用 vue 的时候，我们有两种方式来创建我们的 HTML 页面，第一种情况，也是大多情况下，我们会使用模板 template 的方式，因为这更易读易懂也是官方推荐的方法；第二种情况是使用 render 函数来生成 HTML，它比 template 更接近最终结果。
complier 的主要作用是解析模板，生成渲染模板的 render， 而 render 的作用主要是为了生成 VNode
complier 主要分为 3 大块：

parse：接受 template 原始模板，按着模板的节点和数据生成对应的 ast
optimize：遍历 ast 的每一个节点，标记静态节点，这样就知道哪部分不会变化，于是在页面需要更新时，通过 diff 减少去对比这部分 DOM，提升性能
generate 把前两步生成完善的 ast，组成 render 字符串，然后将 render 字符串通过 new Function 的方式转换成渲染函数

## Vue3

### v3 的生命周期

onBeforeMount onMounted onBeforeUpdate onUpdated onUnmount onUnmounted

### v3 升级了什么东西

- proxy
- diff 算法的提升
- v3 的哪些块 是什么
- 打包体积更小
  - 因为可以静态的分析模块依赖关系
  - 删除一些未使用的 module.exports 代码

### 关于 v3 的块 之类的内容

首先，在 DOM 树级别。我们注意到，在没有动态改变节点结构的模板指令（例如 v-if 和 v-for）的情况下，节点结构保持完全静态。如果我们将一个模板分成由这些结构指令分隔的嵌套“块”，则每个块中的节点结构将再次完全静态。当我们更新块中的节点时，我们不再需要递归遍历 DOM 树 - 该块内的动态绑定可以在一个平面数组中跟踪。这种优化通过将需要执行的树遍历量减少一个数量级来规避虚拟 DOM 的大部分开销。

其次，编译器积极地检测模板中的静态节点、子树甚至数据对象，并在生成的代码中将它们提升到渲染函数之外。这样可以避免在每次渲染时重新创建这些对象，从而大大提高内存使用率并减少垃圾回收的频率。

第三，在元素级别。编译器还根据需要执行的更新类型，为每个具有动态绑定的元素生成一个优化标志。例如，具有动态类绑定和许多静态属性的元素将收到一个标志，提示只需要进行类检查。运行时将获取这些提示并采用专用的快速路径。

### 逃不开的 hook

### v3 新增的组合式 api

ref、 reactive、 watchEffect、setup、toRef、toRefs

### vue3 比 vue2 好在哪里

- 性能比 vue2.x 快 1.2~2 倍
  - diff 算法更快，vue2.0 是需要全局去比较每个节点的，若发现有节点发生变化后，就去更新该节点。vue3.0 是在创建虚拟 dom 中，会根据 DOM 的的内容会不会发生内容变化，添加静态标记， 谁有 flag！比较谁
  - 对动态绑定的事件（点击事件等）进行缓存，就没有必要追踪变化
- 支持 tree-shaking，按需编译，体积比 vue2.x 更小
  - 使用了 vite，其实现原理是利用 ES6 的 import 会发送请求去加载文件的特性，拦截这些请求，做一些预编译，省去 webpack 冗长的打包时间
- 支持组合 API
- 数据双向绑定从 Object.defineProperty 变成了 new Proxy，对于数组不用再使用 $set 了

### ref 和 reactive 的简单理解

ref 和 reactive 都是 vue3 的监听数据的方法，本质是 proxy
ref 基本类型复杂类型都可以监听(我们一般用 ref 监听基本类型)，reactive 只能监听对象（arr，json）
ref 底层还是 reactive，ref 是对 reactive 的二次包装， ref 定义的数据访问的时候要多一个.value

在 Vue3 中，你可以使用 ref 和 reactive 来创建响应式属性。响应式属性使得数据在变化时能够自动触发视图更新。主要区别如下：

使用方法：使用 ref 来创建基本类型的响应式属性，使用 reactive 来创建对象或数组的响应式属性。
引用：ref 返回一个包含响应式数据的对象，而 reactive 返回一个包含响应式数据的代理对象。
访问：响应式属性使用时需要通过.value 进行访问，例如：myProperty.value。
更新：基本类型的响应式属性更新时需要使用.value，而对象或数组的响应式属性则直接进行修改。

### Vue3 中，如何处理列表渲染的性能问题？

使用 key 属性：给列表中的每个元素添加唯一的 key 属性，这有助于 Vue 正确地识别和跟踪列表项的变化，从而提高重用性和渲染性能。

避免复杂的计算：尽量避免在列表渲染中使用复杂的计算或方法调用，特别是在模板中。可以在 computed 属性中预先计算数据，以减少模板中的计算开销。

使用 v-for 和 v-if 合理：在列表渲染中，尽量避免在同一元素上同时使用 v-for 和 v-if，因为它们可能会影响到列表的重用性。可以使用计算属性或在渲染函数中进行逻辑判断。

虚拟滚动：对于大型列表，考虑使用虚拟滚动（virtual scroll）技术，只渲染可见区域内的元素，从而减少不必要的渲染。

分页加载：如果可能，将列表分页加载，只渲染当前页的数据。这可以减少初始渲染的负担。

懒加载：对于异步操作，使用异步组件和 v-if 来延迟加载列表项，从而提高初始加载性能。

使用< template v-for >：使用< template >标签进行 v-for 循环，以避免在渲染过程中创建额外的 DOM 元素。

Memoization：使用 computed 属性或 setup 函数中的 ref 来存储已计算的结果，以避免在列表渲染中重复计算。

避免频繁的数据变化：如果列表中的数据变化非常频繁，可以考虑对数据进行一些节流或防抖处理，以减少不必要的渲染。

### vue3 相对于 vue2 的生命周期变化

生命周期的变化

beforeCreate 和 created 变成了 setup

然后其他的生命周期钩子都加了 on 关键字

onBeforeMount 等等

但销毁方法 beforeDestroy 变成了 onBeforeUnmount， destoryed 变成了 onUnmounted，其他都保持一致

### Vue 3 与 Vue 2 相比有哪些新特性？

### 如何在 Vue 3 中创建一个组件？

### Vue 3 中的 Composition API 是什么？

### Vue 3 中的生命周期钩子有哪些变化？

### 如何在 Vue 3 中使用计算属性和侦听器？

### Vue 3 的响应式系统有什么改进？

### 如何在 Vue 3 中处理表单输入？

### Vue 3 中的 Teleport 组件是什么？

### Vue 3 中的指令有哪些变化？

### Vue 3 中的事件处理有哪些变化？

### 如何在 Vue 3 中使用条件渲染和列表渲染？

### 解释 Vue 3 中的插槽（Slots）的用法。

### Vue 3 中的 Fragment、Suspense 组件是什么？

### 如何在 Vue 3 中实现父子组件通信？

### Vue 3 中的 Provide/Inject 是什么？

### 如何在 Vue 3 中创建响应式数据？

### Vue 3 中的 `ref` 和 `reactive` 有什么区别？

### Vue 3 中的 Composition API 是如何用于组织代码的？

### 如何在 Vue 3 中使用生命周期钩子？

### Vue 3 中的 Teleport 组件是如何使用的？

### 在 Vue 3 中如何创建全局状态管理？

### Vue 3 中如何实现路由的懒加载？

### Vue 3 中的 Suspense 组件是用来做什么的？

### Vue 3 中的动态指令是如何使用的？

### Vue 3 中的 Fragment 组件有什么用途？

### Vue 3 中的 Vue Router 和 Vuex 有什么变化？

### Vue 3 中的单文件组件（.vue 文件）有哪些新特性？

### 解释 Vue 3 的响应式原理和 Refs 的用法。

### Vue 3 中如何使用动态组件和异步组件？

### Vue 3 中的 Props 是如何工作的？

### 在 Vue 3 中如何创建和使用自定义指令？

### Vue 3 中的 Composition API 如何替代 Mixins？

### 如何在 Vue 3 中进行服务端渲染（SSR）？

### Vue 3 中的脚本设置（Script Setup）是什么？

### Vue 3 中的模板引用（Template Refs）是怎样的？

### 如何在 Vue 3 中处理错误和异常？

### Vue 3 中的组件生命周期有什么变化？

### Vue 3 中的依赖注入机制（Provide/Inject）是怎样的？

### Vue 3 中的 Transition 组件有哪些新特性？

### Vue 3 中的全局 API 有哪些变化？

### Vue 3 中的响应式系统是如何优化的？

### Vue 3 如何支持 TypeScript？

### Vue 3 中的 `setup` 函数是如何工作的？

### Vue 3 中的异步组件是如何实现的？

### Vue 3 如何处理组件之间的复用？

### Vue 3 中的 `watchEffect` 有什么用途？

<!-- 用于监听某个属性，一旦有变化会自动调用相关逻辑 -->

在 Vue 3 中，我们可以通过将 lazy 选项设置为 true 来使 watchEffect 函数变为懒执行

### Vue 3 如何实现国际化？

### inject 和 provide

### v3 的 v-model

### v3 的路由模式

最常见的还是编程式导航，这时候需要引入 useRouter 方法：

import { useRouter } from 'vue-router'

const router = useRouter()

// 字符串路径
router.push('/user')

// 带有路径的对象
router.push({ path: '/user', query: { username: 'Jack' } })
router.push({ path: '/user', hash: '#team' })

// 带有命名的对象
router.push({ name: 'user', query: { username: 'Jack' } })
router.push({ name: 'user', params: { username: 'Tom' } })
router.push({ name: 'user', hash: '#team' })

### v3 的路由守卫

### Vue 3 中的渲染函数和 JSX 支持如何使用？

### Vue 3 中的自定义指令是如何创建的？

### Vue 3 中的依赖注入（Provide/Inject）如何使用？

### Hooks 的各类规范

Hook 的命名需要以 use 开头，比如 useTimeOut，这是约定俗成的，开发者看到 useXXX 即可明白这是一个 Hook。Hook 的名称需要清楚地表明其功能。
只在当前关注的最顶级作用域使用 Hook，而不要在嵌套函数、循环中调用 Hook
函数必须是纯函数，没有副作用
返回值是一个函数或数据，供外部使用
Hook 内部可以使用其他的 Hook，组合功能
数据必须依赖于输入，不依赖于外部状态，保持数据流的明确性
在 Hook 内部处理错误，不要把错误抛出到外部，否则会增加 hook 的使用成本
Hook 是单一功能的，不要给一个 Hook 设计过多功能。

### v3 的响应式比 v2 好在哪里

从以下几个点进行回答

- v2 的原理和缺陷：缺陷：只对初始对象的属性有监听作用，而对新增的属性无效。
- v3 是怎么解决的
- 阐述一下 mvvm 和自己对响应式的理解
- 说到响应式还可以讲一下双向数据绑定和单向数据流

### Teleport 是什么 suspense

### v3 的 watch 可以监听多个变量，如何监听

### 请解释一下 Vue3 中的"Block Tree"和"Fragment"的概念

在 Vue3 中，"Block Tree"（块级树）和"Fragment"（片段）是两个与模板渲染相关的重要概念。
「Block Tree（块级树）」：
块级树是 Vue3 中一种优化渲染性能的机制。它基于模板编译的结果，将模板中的各个块（Block）转化为一系列的指令和函数调用，以减少不必要的渲染开销。这种机制的主要目的是在渲染时避免不必要的 DOM 操作，从而提高性能。
块级树的概念涉及到编译器对模板的解析和优化。Vue3 编译器会将模板解析成一个块级树，每一块对应着模板中的一段代码逻辑。然后，这些块会被合并有优化，以生成更高效的渲染代码。块级树的概念隐藏在后台，开发者不需要直接操作它，但了解它有助于理解 Vue3 是如何通过编译优化提高性能的。
「Fragment（片段）」：
Fragment（片段）是 Vue3 中的另一个概念，它是一种用于包裹多个元素的特殊组件。在以前的版本中（如 Vue2），模板要求根元素必须是单一的，这可能导致在一些情况下不必要的包裹元素。而在 Vue3 中，可以使用 Fragment 来解决这个问题。
使用 Fragment，可以将多个元素包裹在一个逻辑块中，而不需要额外的 DOM 元素。这对于需要在模板中渲染多个相邻元素，但不希望在 DOM 中引入多余包裹的情况非常有用。

```js

```

### Vue3 中的事件侦听器和 Vue2 中有何不同？

而在 Vue3 中，可以通过特殊的 event 变量来传递事件对象。例如：@click="handleClick(event 变量来传递事件对象。例如：@click="handleClick(event 变量来传递事件对象。例如：@click="handleClick(event)"。

在 Vue3 中，你可以在一个事件绑定中使用多个事件处理函数，它们将按照顺序执行。例如：@click="handleClick1;handleClick2"。
动态事件名：在 Vue3 中，可以使用动态事件名，就像你使用动态属性名一样。例如：@{{eventName}}。

### 样式相关

v-bind:css 变为 v-bind:css-vars：在 Vue2 中，你可以使用 v-bind:css 来绑定一个动态的样式对象（写在 css 样式中，可以使用该标签来调用 data 中定义的数据）。在 Vue3 中，这被更改为 v-bind:css-vars。

### 在 Vue3 中，如何优化性能？请谈谈一些相关的技巧

使用 Compositon API：Vue3 的 Compositon API 允许你更好地组织和复用代码，从而提高代码的可读性和维护性。使用合适的逻辑组合可以减少不必要的组件渲染和重复代码。
适度使用 Fragment 和 Teleport：Vue3 引入的 Fragment 和 Teleport 特性可以帮助你更好地控制 DOM 结构，避免不必要的包裹元素，从而减少渲染开销。
优化模板：：Vue3 中的编译优化机制可以减少模板的编译和渲染开销。使用合适的模板结构，尽量避免复杂的嵌套，有助于提高性能。
使用事件侦听器的参数：Vue3 中的事件侦听器参数可以通过$event 变量传递，避免在模板中频繁使用方法调用，减少性能开销。
优化组件渲染：使用合适的 v-if 和 v-for 条件渲染，避免频繁的组件创建和销毁。使用 key 属性来确保组件的正确复用。
懒加载组件：使用异步组件来延迟加载不必要的组件，从而减少初始夹在时的开销。
使用 Memoization：使用 computed 和 watch 等特性来避免不必要的计算和渲染。使用 ref 和 reactive 来确保仅在需要时才触发渲染。
合理使用动画：谨慎使用复杂的动画效果，尤其是在大型列表和表格中。优化动画的性能可以避免影响整体渲染性能。
性能监测工具：使用 Vue Devtools 等性能监测工具来分析和优化你的应用，识别性能瓶颈和问题。
Tree Shaking 和代码拆分：使用 Webpack 等工具进行 Tree Shaking 和代码拆分，只打包所需的代码，减少不必要文件大小。
