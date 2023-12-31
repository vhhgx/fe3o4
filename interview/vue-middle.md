# 复杂问题

## Vue2

### Vue 2 的响应式系统的内部工作原理是什么？

### 如何在 Vue 2 中优化大型应用的性能？

### Vue 2 中的虚拟 DOM 是如何工作的？

### Vue 2 中的渲染函数是什么，如何使用它们？

### 在 Vue 2 中如何实现自定义的双向绑定？

### Vue 2 中的依赖注入机制是怎样的？

### 如何在 Vue 2 中处理全局状态？

### Vue 2 中的函数式组件是什么？

### Vue 2 中的异步组件是如何工作的？

### Vue 2 中如何使用 Mixins 和 HOCs（高阶组件）？

### 在 Vue 2 中如何进行单元测试和端对端（E2E）测试？

### 如何在 Vue 2 中管理路由的权限和认证？

### Vue 2 的 SSR 和预渲染有什么区别？

### Vue 2 中的编译过程是怎样的？

### Vue 2 中的插件系统如何工作？

### Vue 中的虚拟 DOM 是如何实现的？

### Vue 的响应式系统是如何跟踪依赖的？

### Vue 的 `render` 函数是如何工作的？

### Vue 中的插槽（Slot）底层是如何实现的？

### Vue 中的 `provide` 和 `inject` 是如何工作的？

### Vue 的响应式系统和数组的处理有什么特别之处？

### Vue 中的 `template` 编译过程是怎样的？

### Vue 的混入（Mixins）是如何实现的？

### Vue 为何需要虚拟 DOM？

虚拟 dom 是使用 js 来描述一个 dom 元素的方法。通过比较虚拟 dom 之间的变化并最小化的对真实 dom 进行操作。可以提高页面渲染的效率

虚拟 DOM 的工作原理可以分为以下几个步骤：

1. 初始渲染：当页面加载时，虚拟 DOM 会通过 JS 对象表示整个页面的结构，这个虚拟 DOM 树是一种轻量级的数据结构，它可以很快地进行创建和修改。
2. 更新触发：当页面状态发生改变时，比如用户交互、数据更新等，会触发重新渲染。在这个过程中，应用会生成新的虚拟 DOM 树。
3. 虚拟 DOM 比较：新生成的虚拟 DOM 树会和之前的虚拟 DOM 树进行比较，找出两者之间的差异。
4. 最小化操作：通过比较，找出需要更新的部分，然后将这些差异应用到真实的 DOM 树上，从而最小化对真实 DOM 的操作。

可以减少对真实 dom 的操作，从而提高渲染性能

### Vue 中如何实现自定义的响应式属性？

### v2 的响应式

Observe(被劫持的数据对象) Compile(vue 的编译器) Wather(订阅者) Dep(用于收集 Watcher 订阅者们) 1.需要给 Observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter 这样的属性，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。
2.Compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3.Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是: ① 在自身实例化时往属性订阅器(Dep)里面添加自己 ② 自身必须有一个 update()方法 ③ 待属性变动 dep.notice() 通知时，能调用自身的 update() 方法，并触发 Compile 中绑定的回调，则功成身退。
4.MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。

### 虚拟 DOM

(1). 什么是虚拟 DOM
虚拟(Virtual) DOM 其实就是一棵以 JavaScript 对象（VNode 节点）作为基础的树，用对象属性来描述节点，相当于在 js 和真实 dom 中间加来一个缓存，利用 dom diff 算法避免没有必要的 dom 操作，从而提高性能。当然算法有时并不是最优解，因为它需要兼容很多实际中可能发生的情况，比如后续会讲到两个节点的 dom 树移动。
在 vue 中一般都是通过修改元素的 state,订阅者根据 state 的变化进行编译渲染，底层的实现可以简单理解为三个步骤：

1、用 JavaScript 对象结构表述 dom 树的结构，然后用这个树构建一个真正的 dom 树，插到浏览器的页面中。
2、当状态改变了，也就是我们的 state 做出修改，vue 便会重新构造一棵树的对象树，然后用这个新构建出来的树和旧树进行对比（只进行同层对比），记录两棵树之间的差异。
3、把记录的差异再重新应用到所构建的真正的 dom 树，视图就更新了。

它的表达方式就是把每一个标签都转为一个对象，这个对象可以有三个属性：tag、props、children

tag：必选。就是标签。也可以是组件，或者函数
props：非必选。就是这个标签上的属性和方法
children：非必选。就是这个标签的内容或者子节点，如果是文本节点就是字符串，如果有子节点就是数组。换句话说 如果判断 children 是字符串的话，就表示一定是文本节点，这个节点肯定没有子元素

(2). 虚拟 DOM 的解析过程
虚拟 DOM 的解析过程：

首先对将要插入到文档中的 DOM 树结构进行分析，使用 js 对象将其表示出来，比如一个元素对象，包含 TagName、props 和 Children 这些属性。然后将这个 js 对象树给保存下来，最后再将 DOM 片段插入到文档中。
当页面的状态发生改变，需要对页面的 DOM 的结构进行调整的时候，首先根据变更的状态，重新构建起一棵对象树，然后将这棵新的对象树和旧的对象树进行比较，记录下两棵树的的差异。
最后将记录的有差异的地方应用到真正的 DOM 树中去，这样视图就更新了。

(3). 为什么要用虚拟 DOM
① 保证性能下限，在不进行手动优化的情况下，提供过得去的性能 看一下页面渲染的流程：解析 HTML -> 生成 DOM -> 生成 CSSOM -> Layout -> Paint -> Compiler 下面对比一下修改 DOM 时真实 DOM 操作和 Virtual DOM 的过程，来看一下它们重排重绘的性能消耗 ∶

真实 DOM∶ 生成 HTML 字符串＋重建所有的 DOM 元素
虚拟 DOM∶ 生成 vNode+ DOMDiff ＋必要的 dom 更新

Virtual DOM 的更新 DOM 的准备工作耗费更多的时间，也就是 JS 层面，相比于更多的 DOM 操作它的消费是极其便宜的。尤雨溪在社区论坛中说道 ∶ 框架给你的保证是，你不需要手动优化的情况下，依然可以给你提供过得去的性能。
② 跨平台 Virtual DOM 本质上是 JavaScript 的对象，它可以很方便的跨平台操作，比如服务端渲染、uniapp 等。
(4). 虚拟 DOM 真的比真实 DOM 性能好吗

首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢。
正如它能保证性能下限，在真实 DOM 操作的时候进行针对性的优化时，还是更快的。

39. Diff 算法
    在新老虚拟 DOM 对比时：

首先，对比节点本身，判断是否为同一节点，如果不为相同节点，则删除该节点重新创建节点进行替换
如果为相同节点，进行 patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的 children 没有子节点，将旧的子节点移除)
比较如果都有子节点，则进行 updateChildren，判断如何对这些新老节点的子节点进行操作（diff 核心）。
匹配时，找到相同的子节点，递归比较子节点

在 diff 中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从 O(n3)降低值 O(n)，也就是说，只有当新旧 children 都为多个子节点时才需要用核心的 Diff 算法进行同层级比较。

### new Vue() 做了什么？

new Vue() 是创建一个新的 Vue 实例，我们可以从以下几个步骤去分析 new Vue() 整个过程都干了些什么？
首先第一步就是“初始化”，在该步骤中，会对组件实例进行初始化操作。

第一步：初始化

首先是进行一些必要的初始化操作：合并配置项、生命周期钩子函数、监听事件和 render 函数。因为 Vue 框架规定，每个实例，必须有规定的生命周期函数等，所以在一开始，我们需要将这几项初始化好。
接着就是执行钩子函数 beforeCreate
此时就可以初始化注入函数、状态
接着就继续执行钩子函数 created

当需要的东西都已初始化完毕，那么下一步，我们就需要将该组件实例转换成 VNode，并将 VNode 转换为真实 DOM，并挂载到页面上。这一步我们可以叫“挂载”

第二步：挂载

挂载前，需要先确认 render 函数存在与否，template 存在与否，如果它们不存在就需要做一些处理
等这些都处理完毕后，就可以执行钩子函数 beforeMount
接着，我们就需要为更新机制做些准备工作，比如：初始化 updateComponent、watcherOptions，待准备工作完成，就需要进行更新机制的形成了
到此为止，我们的组件实例就已经完成挂载操作，然后执行钩子函数 mounted

需要特别注意的是更新机制形成的过程，updateComponent 的 watcherOptions 的作用：

updateComponent，在初始化它时，我们的创建 VNode 和生成真实 DOM 这两工作，就是在这里完成的
watcherOptions，初始化它后，在页面更新前会调用 before 函数，因此会触发钩子 beforeCreate

接下来，我们说说生成 VNode 节点这个工作：如果组件实例不满足一定条件的话，就会直接返回一个空的 VNode，满足了就会将组件实例转换成对应的 VNode，并返回
此时我们已经得到该组件实例对应的 VNode，需要将它们转换为真实 DOM，并挂载到页面上。在转换之前，需要将旧状态的 el、VNode 和活动实例都备份一份下来，然后获取组件的最新信息，并更新指向。这里最重要的是 patch 算法，也就是我们日常所说的 diff 算法，它的规则是这样的：

新节点不存在，老节点存在，调用 destroy，销毁老节点

如果 oldVnode 是真实元素，则表示首次渲染，创建新节点，并插入 body，然后移除老节点

如果 oldVnode 不是真实元素，则表示更新阶段，执行 patchVnode

到此，真实 DOM 就被创建渲染完成。

### 组件使用 v-model 的本质：

将其 value attribute 绑定到⼀个名叫 modelValue 的 prop 上；
在其 input 事件被触发时，将新的值通过自定义的 update: modelValue 事件抛出 (发出)；

JavaScript 复制代码<Counter v-model="appCounter"/>

<!-- 相当于-->

<Counter v-bind:modelValue="appCounter" @update:modelValue="appCounter =$event"/>

## Vue3

### Vue 3 的 Composition API 底层原理是什么？

### Vue 3 的响应式系统和 Vue 2 相比有哪些底层变化？

### Vue 3 中的虚拟 DOM 和渲染优化是怎样的？

### 如何在 Vue 3 中使用 TypeScript？

### Vue 3 中的渲染函数和 JSX 支持如何实现？

### 在 Vue 3 中如何实现自定义的双向绑定？

### Vue 3 的新特性如何改善性能和树摇（Tree Shaking）？

### Vue 3 中的 Teleport 和 Suspense 组件的实际应用场景是什么？

### Vue 3 中的异步组件加载机制是怎样的？

### Vue 3 中的 Reactivity API 是如何工作的？

### 在 Vue 3 中如何进行单元测试和端对端（E2E）测试？

### Vue 3 中如何处理复杂的表单验证？

### Vue 3 中的 SSR 和预渲染有什么新特性？

### 如何在 Vue 3 中优化大型应用的性能？

### Vue 3 中的插件系统有什么变化？

### Vue 3 中的 Proxy-based 响应式系统是如何工作的？

### Vue 3 中的 Composition API 如何提升性能？

### Vue 3 中的模块动态导入（Dynamic Module Import）是如何实现的？

### Vue 3 中的 Suspense 和异步组件是如何协同工作的？

### Vue 3 中的 Teleport 是如何实现的？

### Vue 3 中的渲染优化技术是什么？

### Vue 3 中的 Vite 构建工具有什么优势？

### Vue 3 的 SSR 支持是如何实现的？

### Vue 3 中的 TypeScript 集成是怎样的？

### Vue 3 的 Composition API 如何改变了组件的复用方式？
