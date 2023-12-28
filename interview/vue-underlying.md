# 源码层面

## Vue2

### 框架基本原理

当一个 Vue 实例创建时，Vue 会遍历 data 中的属性，用 Object.defineProperty（vue3.0 使用 proxy ）将它们转为 getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

### 虚拟 DOM

通过 js 对象来描述一个 dom 树，在页面有变化的时候，通过比较虚拟 dom 树的变化，并最小化对真实 dom 的操作，从而提高效率。

初始化阶段：render 函数结合 data 映射为虚拟 DOM 树
渲染阶段：根据虚拟 DOM 树生成真实的 DOM 并渲染到页面上。
更新阶段：当状态发生变化时，生成新的虚拟 DOM 树。
对比阶段：比较新旧两棵虚拟 DOM 树的差异，找出需要更新的部分。
批量更新阶段：将差异部分批量更新到真实 DOM 上。

这种方式可以减少对真实 DOM 的频繁操作，减少浏览器的回流和重绘，提高页面渲染性能。因为直接操作真实 DOM 是非常昂贵的，而虚拟 DOM 可以通过批量更新的方式来减少对真实 DOM 的操作次数。

### create 阶段

#### 普通 VNode

Vue 在自身初始化阶段会调用`initRender`函数，在该函数中定义了两个用于生成`VNode`的函数。手写`render`函数调用`vm.$createElement`函数，而编译后的`render`函数则调用`vm._c`函数。两者唯一区别在于调用`createElement()`时的最后一个参数，`vm._c`为`false`，`vm.$createElement`则为`true`

`createElement()`函数对参数进行处理后调用`_createElement`函数，该函数才是生成 VNode 的重要逻辑。主要做以下几件事

1. 不符合要求的数据报错并返回`空VNode`，比如为响应式 data 等
2. 对传入的`children`做`normalize`规范化处理，比如生成`文本型VNode`等，将其返回
3. 再根据生成的结果调用`new VNode()`来生成不同的`VNode`
4. 判别为组件则会调用`createComponent()`来生成组件`Vnode`

#### 组件 VNode

获取到自身初始化时缓存的`Vue`实例作为基础构造器，然后调用其 extend 方法构造一个组件构造器 Ctor。处理自定义事件，安装组件钩子。最后创建前缀为`vue-component-`的组件 Vnode，并将其返回

关于安装组件钩子，就是遍历先前定义的`componentVnodeHooks`对象的 key 数组`[init, prepatch, insert, destory]`。然后调用`mergeHook()`函数将其合并

#### 总结

经过上述流程，VNode 就已创建完毕，接下来是 patch 过程。通过`__patch__`函数进行挂载

### patch 阶段

经过层层调用，最后调用的`patch`函数是`createPatchFunction`函数的返回值。`patch`函数逻辑非常复杂

会先通过`sameVnode()`函数判断新旧节点是否一致，相同则执行`patchVnode()`函数

1. 先通过`nodeOps.parentNode()`函数获取其父节点，这样就可以知道新节点要挂载到哪里
2. 然后更新父占位符节点，执行组件钩子
3. 然后删除旧节点

### Vue 2 的响应式系统是如何实现的？具体是怎样追踪依赖的

vue 实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty（）来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。
vue 的数据双向绑定 将 MVVM 作为数据绑定的入口，整合 Observer，Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 的数据变化，通过 Compile 来解析编译模板指令（vue 中是用来解析 {{}}），最终利用 watcher 搭起 observer 和 Compile 之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据 model 变更双向绑定效果。

心 API——Object.defineProperty(obj, prop, descriptor)

监听对象、监听数组
复杂对象、深度监听

Object.defineProperty 缺点：

深度监听，需要递归到底，一次性计算量大
无法监听新增属性/删除属性（Vue.set Vue.delete）
无法原生监听数组，需要特殊处理

### 使用 Object.defineProperty() 来进行数据劫持有什么缺点？

在对一些属性进行操作时，使用这种方法无法拦截，比如通过下标方式修改数组数据或者给对象新增属性，这都不能触发组件的重新渲染，因为 Object.defineProperty 不能拦截到这些操作。更精确的来说，对于数组而言，大部分操作都是拦截不到的，只是 Vue 内部通过重写函数的方式解决了这个问题。
在 Vue3.0 中已经不使用这种方式了，而是通过使用 Proxy 对对象进行代理，从而实现数据劫持。使用 Proxy 的好处是它可以完美的监听到任何方式的数据改变，唯一的缺点是兼容性的问题，因为 Proxy 是 ES6 的语法。

### Vue 2 中的模板编译过程是如何进行的

vue 中的模板 template 无法被浏览器解析并渲染，因为这不属于浏 览器的标准，不是正确的 HTML 语法，所有需要将 template 转化成一 个 JavaScript 函数，这样浏览器就可以执行这一个函数并渲染出对 应的 HTML 元素，就可以让视图跑起来了，这一个转化的过程，就成 为模板编译。模板编译又分三个阶段，解析 parse，优化 optimize，生成 generate，最终生成可执行函数 render。

解析阶段：使用大量的正则表达式对 template 字符串进行解析，将 标签、指令、属性等转化为抽象语法树 AST。
优化阶段：遍历 AST，找到其中的一些静态节点并进行标记，方便在 页面重渲染的时候进行 diff 比较时，直接跳过这一些静态节点，优 化 runtime 的性能。
生成阶段：将最终的 AST 转化为 render 函数字符串。

### Vue3.0 为什么要用 proxy

在 Vue2 中， 0bject.defineProperty 会改变原始数据，而 Proxy 是创建对象的虚拟表示，并提供 set 、get 和 deleteProperty 等 处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截，Proxy 有以下特点 ∶

不需用使用 Vue.set 或 Vue.set 或 Vue.set 或 Vue.delete 触发响应式。
全方位的数组变化检测，消除了 Vue2 无效的边界情况。
支持 Map，Set，WeakMap 和 WeakSet。
Proxy 实现的响应式原理与 Vue2 的实现原理相同，实现方式大同小异 ∶
get 收集依赖
Set、delete 等触发依赖
对于集合类型，就是对集合对象的方法做一层包装：原方法执行后执 行依赖相关的收集或触发逻辑

### Vue 2 的组件实例化过程是怎样的？

### 在 Vue 2 源码中，生命周期钩子是如何被调用的？

### Vue 2 的侦听器是如何实现的？

### 描述 Vue 2 中的指令系统实现。

### Vue 2 中 nextTick 的实现原理是什么？

### Vue 2 的事件系统是如何工作的？

### Vue 2 中的插槽（slot）实现机制是什么？

### Vue 2 的混入（mixin）机制是如何实现的？

### Vue 2 中如何实现组件之间的通信？

### Vue 2 的依赖注入（provide/inject）是如何工作的？

### Vue 2 源码中是如何处理数组方法的？

### 在 Vue 2 中，如何实现对对象属性的侦听？

### Vue 2 的 VNode 结构是怎样的？

### Vue 2 中的 diff 算法是如何实现的？

### Vue 2 的模板解析器是如何工作的？

### Vue 2 中 keep-alive 组件的实现原理是什么？

## Vue3

### vue3 的 diff，需要仔细看看

DOM 树级别：在没有动态改变节点结构的模板指令（例如 v-if 和 v-for）的情况下，节点结构保持完全静态。如果我们将一个模板分成由这些结构指令分隔的嵌套“块”，则每个块中的节点结构将再次完全静态。当我们更新块中的节点时，我们不再需要递归遍历 DOM 树 - 该块内的动态绑定可以在一个平面数组中跟踪。这种优化通过将需要执行的树遍历量减少一个数量级来规避虚拟 DOM 的大部分开销。② 编译器：积极检测模版中的静态节点、子树、数据对象，并在生成的代码中将他们提升到渲染函数之外。这样可以避免每次渲染时重新创建这些对象，从而打打提高内存使用率并减少垃圾回收的频率。③ 元素级别：编译器还根据需要执行的更新类型，为每个具有动态绑定的元素生成一个优化标志。例如，具有动态类绑定和许多静态属性的元素将收到一个标志，提示只需要进行类检查。运行时将获取这些提示并采用专用的快速路径。Vue 3 有时占用的 CPU 时间不到 Vue 2 的十分之一

### Vue 3 的响应式系统与 Vue 2 相比有哪些改进？

### Vue 3 中是如何使用 Proxy 实现响应式的？

### Vue 3 中的 Composition API 的实现原理是什么？

### Vue 3 的虚拟 DOM 和渲染器的实现有哪些变化？

### 描述 Vue 3 中的模板编译过程。

### Vue 3 中的异步组件加载机制是怎样的？

### Vue 3 中 Teleport 组件的实现原理是什么？

### Vue 3 如何实现自定义渲染器（Custom Renderer）？

### Vue 3 的响应式系统中的 Ref 和 Reactive 是如何实现的？

### Vue 3 中的 Suspense 组件是如何实现的？

### Vue 3 中的依赖收集和触发更新的机制是怎样的？

### Vue 3 中的 Fragment、Suspense 和 Teleport 是如何实现的？

### Vue 3 中的 reactivity-transform 特性是如何实现的？

### Vue 3 的事件处理机制有何变化？

### Vue 3 中的 SSR 支持和实现方式是什么？

### Vue 3 中的 Vite 构建工具是如何与 Vue 配合的？

### Vue 3 如何处理模板中的动态指令？

### Vue 3 的 diff 算法与 Vue 2 有什么不同？

### Vue 3 中的 TypeScript 集成是如何实现的？

### Vue 3 的 Composition API 中的 watch 和 watchEffect 实现细节是什么？

### vue3 的 toref torefs

### vue3 为什么选择 vite？

①vite 比 webpack 更快
在 webpack 开发时构建时，默认会抓取并构建你的整个应用，然后才能提供服务，这就导致了你的项目中存在任何一个错误（即使当前错误不是首页引用的模块），他依然会影响到你的整个项目构建。所以你的项目越大，构建时间越长，项目启动速度也就越慢。
vite 不会在一开始就构建你的整个项目，而是会将引用中的模块区分为依赖和源码（项目代码）两部分，对于源码部分，他会根据路由来拆分代码模块，只会去构建一开始就必须要构建的内容。
同时 vite 以原生 ESM 的方式为浏览器提供源码，让浏览器接管了打包的部分工作。

