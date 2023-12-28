# 源码相关问题

## 新 - 响应式原理

### 1. 劫持对象

自身初始化阶段，`initState()`函数中调用`initData()`函数，`initData()`函数调用`observe()`函数。`observe()`实例化一个`Observer`类

经过上面的一大堆调用之后，会先给传入的data添加一个`__ob__`属性。然后遍历value。


即`defineReactive()`函数。在该函数内对传入的所有`data`做数据劫持，添加getter和setter。`get`中通过`dep.depend()`进行依赖收集，`set`中通过`dep.notify()`进行派发更新，数据劫持过程结束。


### 2. 依赖收集

依赖收集发生在初次渲染过程中。即$mount函数。会先执行编译器版本的mount

在编译器版本内判断有无render渲染函数，有无template模板。然后调用`compileToFunctions()`函数将`template`转换为`render`函数，即模板编译

- 在compiler/index.js中，调用parse()把传入的template转为ast
- 调用optimize()把ast进行优化，标记静态元素。
- 调用generate()方法把ast转换为render函数

编译器版本的过程到此为止，然后再调用运行时的mount函数。


运行时的mount函数会调用`mountComponent()`函数。最重要的便是`vm._update(vm._render(), hydrating)`。即初次渲染


在初次渲染的vm._render()时，会触发data的getter钩子。触发getter钩子就会调用数据劫持中的`dep.depend()`进行依赖收集


### 2.1 初次渲染-后续

vm._render()用于将render函数转换为vnode，然后将其返回。这一过程会调用createElement函数。详细不再赘述。

初次渲染时，传入的oldVnode是一个dom容器，所以会通过`emptyNodeAt`将该容器转换为vnode

返回的vnode作为vm._update()函数的参数。为了磨平平台及版本间的差异。vue做了很多层的调用。比如`vm._update()`调用`vm.__patch__`，再调用`patch()`，最后到了`createPatchFunction`。`patch`作为`createPatchFunction`的返回值。

初次渲染的传值为`(vm.$el, vnode, hydrating, false)`，再通过createElm生成真实dom。挂载到el上


### 3. 数据更新



每个key都有独立的



## ❶ 响应式原理（双向数据绑定）

双向数据绑定是指：数据变化更新视图，视图变化更新数据

### ① 原理

#### 1. 劫持对象，添加getter & setter

> 在`vue`中每个组件实例都对应一个watcher实例。会在组件渲染过程中，把属性记录为依赖。当依赖项的`setter`被调用时，会通知`watcher`重新计算。然后重新渲染关联的组件。是一个典型的观察者模式

在自身初始化阶段，`initState()`会调用`initData()`函数。`initData()`函数调用`observe()`，实例化一个`Observer`类，然后将其实例返回。

`Observer`判断传入的`data`值类型，会先调用`def()`函数（即`Object.defineProperty`函数的封装)给`data`加一个`__ob__`属性。这里使用`defineProperty`的原因是如果直接给data挂载`__ob__`属性，会在接下来的`walk`函数中给`__ob__`属性执行`defineReactive()`方法。

若为数组会判断是否有`__proto__`属性，有则调用`protoAugment()`把前面重写的Array方法挂载到目标的原型链上。没有则调用`copyAugment()`方法遍历keys把修改过的数组方法挂载到目标数据上，而若为对象则调用`walk()`方法，即遍历value，调用`defineReactive()`为其添加响应式

`defineReactive()`通过`Object.defineProperty()`函数给`obj[key]`添加`get`和`set`方法。`get`中通过`dep.depend()`进行依赖收集，`set`中通过`dep.notify()`进行派发更新

#### 2. 数据变动，更新视图（_render函数)

然后compiler解析模板，将模板中的变量替换为数据，渲染页面时触发`getter`。把当前的watch对象收集起来。若有数据变动，则会遍历这个数据的依赖对象（watcher），通过`dep.notify()`通知，更新视图

#### 3. Watcher & Observer

`Watcher`订阅者是`Observer`和`Compile`之间通信的桥梁，主要做以下几件事

1. 在自身实例化时往属性订阅器`dep`里面添加自己
2. 自身必须有一个`update()`函数
3. 待属性变动`dep.notice()`通知时，能调用自身的`update()`函数，并触发`Compile`中绑定的回调

#### 4. 概述

`MVVM`作为数据绑定的入口，整合`Observer`、`Compile`和`Watcher`三者，通过`Observer`来监听自己的`model`数据变化，通过`Compile`来解析编译模板指令，最终利用`Watcher`搭起`Observer`和`Compile`之间的通信桥梁，达到数据变化 -> 视图更新、视图交互变化(input) -> 数据model变更的双向绑定效果


### ② 如何检测数据的变化

在上面`❶ ① 原理`中解释了Vue会在初始化数据的时候订阅所有数据，收集依赖。所以所有需要响应式的数据都需要在data中进行声明。可以将其赋为空值，这样才会在后期值发生改变时更新视图


在data中定义的普通类型数据可以直接进行更改，对象则需要使用`Vue.set(object, key, value)`函数，`vm.$set`是其别名。如果需要赋值多个新property，可以使用`Object.assign()`方法，把源对象和要混合的新对象一起创建一个新对象

```js
this.someObj = Object.assign({}, this.someObj, {a: 1, b: 2})
```

而对于数组来说，`直接使用下标修改数组项`和`直接修改数组的长度`这两种变动无法被监测到。修改数据一样需要使用`Vue.set`方法即`Vue.set(array, index, newValue)`。`set`函数会判断第一个参数是数组还是对象，然后执行不同的逻辑。修改长度则可通过`vm.array.splice()`方法

vue也在源码中缓存了array的原型链，重写了以下7个方法。触发这些方法的时候也会对视图进行更新

- `push()`：可向数组的末尾添加一个或多个元素，并返回新的长度
- `pop()`：用于删除并返回数组的最后一个元素
- `shift()`：用于把数组的第一个元素从其中删除，并返回第一个元素的值
- `unshift()`：可向数组的开头添加一个或更多元素，并返回新的长度
- `splice()`：向/从数组中添加/删除项目，然后返回被删除的项目
- `sort()`：用于对数组的元素进行排序
- `reverse()`：用于颠倒数组中元素的顺序


还有一些方法是操作原数组直接返回新数组，不会触发视图更新。可以把新值赋值给原数组就可以触发视图更新。主要有`filter()`、`concat()`、`slice()`、`map()`这几个方法。比如

```js
arr = arr.filter( item => {
  return item.message.match(/Foo/)
})
```

如果需要显示过滤排序后的结果，可以利用计算属性返回处理后的数据


```
核心实现类:
Observer : 它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新
Dep : 用于收集当前响应式对象的依赖关系,每个响应式对象包括子对象都拥有一个 Dep 实例（里面 subs 是 Watcher 实例数组）,当数据有变更时,会通过 dep.notify()通知各个 watcher。
Watcher : 观察者对象 , 实例分为渲染 watcher (render watcher),计算属性 watcher (computed watcher),侦听器 watcher（user watcher）三种
Watcher 和 Dep 的关系
watcher 中实例化了 dep 并向 dep.subs 中添加了订阅者,dep 通过 notify 遍历了 dep.subs 通知每个 watcher 更新。
依赖收集

initState 时,对 computed 属性初始化时,触发 computed watcher 依赖收集
initState 时,对侦听属性初始化时,触发 user watcher 依赖收集
render()的过程,触发 render watcher 依赖收集
re-render 时,vm.render()再次执行,会移除所有 subs 中的 watcer 的订阅,重新赋值。

派发更新

组件中对响应的数据进行了修改,触发 setter 的逻辑
调用 dep.notify()
遍历所有的 subs（Watcher 实例）,调用每一个 watcher 的 update 方法。


2. computed 的实现原理
computed 本质是一个惰性求值的观察者。
computed 内部实现了一个惰性的 watcher,也就是 computed watcher,computed watcher 不会立刻求值,同时持有一个 dep 实例。
其内部通过 this.dirty 属性标记计算属性是否需要重新求值。
当 computed 的依赖状态发生改变时,就会通知这个惰性的 watcher,
computed watcher 通过 this.dep.subs.length 判断有没有订阅者,
有的话,会重新计算,然后对比新旧值,如果变化了,会重新渲染。 (Vue 想确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化时才会触发渲染 watcher 重新渲染，本质上是一种优化。)
没有的话,仅仅把 this.dirty = true。 (当计算属性依赖于其他数据时，属性并不会立即重新计算，只有之后其他地方需要读取属性的时候，它才会真正计算，即具备 lazy（懒计算）特性。)
```


## ❷ 模板编译相关

模板编译就是将`template`编译成`render函数`的过程，该过程发生在`$mount()`阶段。主要是调用`compileToFunctions()`函数。通过层层调用，编译入口为`src/compiler/index.js`文件的`createCompilerCreator()`函数

**有以下三个步骤**

1. 调用`parse()`函数将传入的`template`进行解析，通过正则表达式将`template`字符串中的元素、属性、文本、`v-for`、vue指令、父子关系等进行处理，生成一个完整的`AST`语法树
2. 调用`optimize()`函数对生成的`AST`语法树进行优化。即深度遍历AST树，按照相关条件调用`markStatic()`函数对树节点进行标记。被标记的节点就可以跳过diff的比对
3. 调用`generate()`函数生成`render函数`，并将其返回


以上的三个步骤执行完之后，模板编译过程便结束了



<!-- -------


接下来的步骤

1. 渲染函数结合data生成vdom
2. vdom通过patch函数将其挂载到真实dom上
3. 数据有更新，再通过diff算法进行比较，调用update函数更新，然后再patch


（每个组件都有一个对应的watcher，用于收集依赖）

然后vnode要经过create、diff、patch



----------------------- -->




## ❸ 虚拟dom相关



## ❹ diff算法相关（没写完再说吧）

`Diff`的出现，就是为了减少更新量，找到最小差异部分`DOM`，只更新差异部分DOM。只会对父节点为相同节点的那一层进行比较。即同级比较，通过`sameVnode()`函数判断`tag`和`key`。如果相同则说明为同一节点，然后比较其子节点。不一样则直接用新节点替换旧节点。Vue会采用节点复用的方式，即新旧节点相同父节点的子节点不会重新生成，而是直接使用。



<!-- 其核心算法采用双指针方式

- `tag`标签不一致直接新节点替换旧节点。
- `tag`标签一样，先替换属性再对比子元素
  - 新旧都有子元素，采用双指针方式进行对比，`sameVnode`判断`tag`和`key`完全相同为同一节点，进行节点复用
  - 头和头对比，尾和尾对比，头和尾对比

乱序情况 -- 上面的都不符合，先遍历旧子节点数组形成 key值映射的map对象。
然后根据新子节点数组循环 按照key值和位置关系移动以及新增节点 最后删除多余的旧子节点 如果移动旧节点同样需要patch(oldChild,newChild)
新的有子元素，老的没有子元素。-- 直接将子元素虚拟节点转化成真实节点插入即可。
新的没有子元素，老的有子元素。 -- 直接清空 innerHtml
3、无 tag 标签 -- 文本节点直接比较内容是否一致 -->


### for循环中key的作用

`diff`时更快的找到变化的位置，因为`key`是节点的唯一标识。方便`sameVnode()`进行比较。更高效的更新虚拟dom。

在diff算法中新节点和旧节点会进行头头、尾尾、头尾之间互相比较，如果四种方式都没匹配上，又设置了key，就会利用key进行比较。因为采用双指针的方式，所以遍历会往中间靠拢，一旦`StartIdx > EndIdx`则表明至少有一个节点遍历完了，就会结束比较。


## ❺ nextTick相关

### 简易原理

因为JS是单线程的，所以dom更新这种费时操作会放在异步队列中进行等待。如果不异步更新，那么每次更新数据都会对当前组件重新渲染。所以为了性能，`Vue`会在本轮数据更新后，再异步更新视图。异步完成后会有回调通知。

如果检测到数据的变化，会开启一个队列，并将在同一事件循环中发生的所有变化推进队列中。`dep.notify()`通知`watcher`进行更新。`subs[i].update`依次调用`watcher`的`update`。如果一个`watcher`被多次触发，那么`queueWatcher`会将`watcher`去重，这样可以避免不必要的重复计算。`nextTick`在下一个`tick`中异步刷新`queueWatcher`队列

所调用的方法依次为`promise.then`、`MutationObserver`、`setImmediate`，如果执行环境不支持则会尝试使用后面的方法。都不支持则会采用`setTimeout(fn, 0)`方法来进行代替


### 使用场景

因为是异步操作，所以数据更改后不会及时更新。使用`vm.$nextTick(cb)`就可以获取到数据更新后最新的dom变化

```js
// old dom
console.log(this.$refs.message)

// new dom
this.$nextTick().then(() => {
  console.log(this.$refs.message)
})
```

### 宏任务和微任务（未完）

宏任务微任务未完，待整理


## ❻ 组件相关

### Vue组件通信方式

#### 父子组件通信

- `父`组件向`子`组件传值：`props`
- `子`组件向`父`组件传值：`$emit` && `v-on`
  - 在父组件中通过`v-on`监听当前实例上的自定义事件
  - 在子组件中通过`$emit`触发父组件上的自定义事件

**父组件**
```html
<Cart @add="cartAdd($event)"></Cart>
```

**子组件**
```js
this.$emit('add', good)
```

#### 兄弟组件通信

1. EventBus
2. Vuex

#### 组件访问

- `父`组件访问`子`组件：`this.$refs` && `this.$children`
- `子`组件访问`父`组件：`this.$parent`
- `兄弟`组件：通过共同的祖辈组件搭桥，`$parent`或`$root`
- `隔代`组件：`provide` && `inject`，`$attrs` && `$listeners`


### 动态组件和异步组件（没整理完）

#### 动态组件

动态组件是vue原生自带的组件，用来动态显示组件。有一个is属性，通过`v-bind:is="动态组件名"`属性，来选择要挂载的组件

动态组件每次切换都会创建和销毁dom，增加性能消耗，通过`<keep-alive>`去缓存已经被渲染过的`component`

#### 异步组件

不太明白


### 什么是递归组件

组件利用name属性，自己调用自己。场景有用于生成树形结构菜单

**组件内部**

```html
<template>
  <ul>
    <li v-for="(item,index) in list " :key="index">
      <p>{{item.name}}</p>
      <treeMenus :list="item.children"></treeMenus>
    </li>
  </ul>
</template>
```
```js
<script>
export default {
  name: "treeMenus",
  props: { list: Array }
}
</script>
```

**调用组件**

```js
<treeMenus :list="treeMenusData"></treeMenus>

treeMenusData: [
  {
    name: "菜单1",
    children: [
      {
        name: "菜单1-1",
        children: []
      }
    ]
  },
]
```

### vue组件name的作用

使用keep-alive时，可搭配name进行缓存过滤
做递归组件时需要调用自身name
调试工具显示的组件名称是组件name
注册全局组件


<!-- Vue实例挂载的过程是什么？

首先，mount对el做了限制，Vue 不能挂载在 body、html 这样的根节点上。
判断options选项中是否有render函数这个属性，有则直接调用原始的\mount方法。如果没有，则判断template是否存在，转换成render，并赋值给options。最后调用原始的$mount方法。
在原始的mount方法中，触发beforeMount钩子，并实例化一个watcher，在第二个参数updateComponent这个函数中调用vm._updated。该函数是首次渲染和更新渲染作用，参数为render函数（vnode），如果vm._vnode不存在则进行首次渲染。同时vnode中被劫持的数据自动收集依赖。当vnode中被劫持的数据变化时候触发对应的依赖，从而触发vm._update进行更新渲染。
最后触发mounted钩子函数。 -->



## keep-alive

使用`keep-alive`标签进行包裹，组件切换时不会对当前组件进行卸载，保留状态避免重新渲染。又由于是一个抽象组件，所以在页面渲染完毕后不会被渲染成一个dom元素

有两个属性，`include`表示包含（白名单）`exclude`表示不包含（黑名单）。可以用字符串、正则表示。这里匹配的是组件的`name`属性

两个生命周期`deactivated`和`activated`。页面第一次进入的时候，生命周期钩子的触发顺序是`created->mounted->activated`。页面退出的时候触发`deactivated`钩子，再次进入页面的时候只触发`activated`钩子。这两个钩子在ssr不会被调用


### mixin、mixins、extend、extends

优先级：extend>extends>mixins

#### mixin

可以将自定义的方法挂载到vue实例上，本质是调用mergeOptions合并options。

#### mixins

::: details mixins
在对象中封装一些公共数据或通用方法，可以通过mixins进行混入，比如以下内容

**commonFuns.js**

```js
export const common = {
  data() {
    return {name: "vhhg"}
  },
  created() {
    this.fns()
  },
  methods: {
    fns() {
      console.log('common data')
    }
  }
}
```

**component.vue**

```js
<script>
	import { common } from '../common.js'
	export default{ mixins: [common] }
</script>
```

**需要注意**

1. 值为对象的选项，如`methods`、`components`等，选项会被合并，键冲突的组件会覆盖混入对象
2. 值为函数的选项，如`created`、`mounted`等，就会被合并调用，混合对象里的钩子函数在组件里的钩子函数之前调用
:::


#### extend

::: details extend
使用基础`Vue.extend()`构造器创建一个子类。可以在组件初始化的时候通过`this._init`赋予组件vue的全部能力。

使用原型继承的方法返回了`Vue`的子类 并且利用`mergeOptions`把传入组件的`options`和父类的`options`进行了合并

```js
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')
```

Vue.extend创建的是vue构造器。需要用`$mount`来将其挂载到dom上
:::


#### extends



---

# 关于vue

- 双向数据绑定
- 响应式原理
- diff算法
- 虚拟dom
- 编译原理





#### diff

在对model进行修改的时候，会触发dep中的watcher。然后watcher调用相应的update来修改视图。然后新vnode和旧vnode节点进行一个patch的过程，对比出差异，然后将差异更新到视图上。diff算法又是patch的核心。diff的核心是`updateChildren`函数





# 响应式


## 数据初始化相关内容


### initProps

1. 校验和求值
2. defineReactive作响应式处理
3. proxy代理


- 获取propsData，vm.$options.propsData无值则设为空对象
- props和vm._props设为空对象
- keys和vm.$options._propKeys设为空数组
- 遍历参数propsOptions中的key，push至keys
  - 调用validateProp对key进行处理
  - 调用hyphenate将key改造成连字符样式
  - 调用defineReactive
- 调用defineReactive


### initMethods

- 遍历每一个methods[key]，如果不是`function`则报错
- 校验methods中的key是否在props有重名，有则报错
- 校验key是否在vm中，且key是否为$ _开头，是的话则报错*与vue实例方法冲突，请改名*



### initData

- 先获取到data「通过options.data或getData()方法
- 校验data是否为object。不是置为空对象并且报错
- 校验data的key是否在methods和props中重名，重名则报错
- 调用observer方法


### initComputed



### initWatch








### initData


在`initData`方法中，先校验`data`、`methods`、`props`中是否有重复的值。然后调用`observe`方法。`observe`方法先判断有无`__ob__`属性。有的话直接返回`__ob__`属性。没有的话再初始化一个新的观察者`Observer`进行返回

在`Observer`观察者类中。创建一个新的`Dep`。然后给传入的参数`value`添加`__ob__`属性，表示该参数已经成为一个观察者。然后根据参数`value`的类型（数组或对象），调用不同的方法

参数为数组，则调用`this.observeArray`方法，遍历数组，给每一个元素再调用`observe`方法。即递归调用调用`observe`方法。使其每一个元素都不是数组

不是数组则即为对象，调用`this.walk`方法，遍历对象的`key`，调用`defineReactive`方法给对象的每个`key`都添加`getter`和`setter`方法




在初始化阶段做数据劫持

然后渲染的时候触发相应的getter，进行依赖收集

数据修改之后，就会触发setter。vue会将所有内容压入一个队列，等全部的数据修改都结束后，再进行dom更新


又涉及到虚拟dom  diff算法等内容   再说吧





## 观察者模式

### observe

- 检测传入的value是否有`__ob__`属性，有的话则把`value.__ob__`赋值于ob
- 否则调用`new Observer()`把value做响应式
- 给ob.vmCount++
- 返回ob

### Observer

- 给传入的参数value添加`__ob__`属性
- value是数组则进行改造 ！！！这里要把这两个方法重新写一下
- 非数组是对象则调用walk方法


### walk

- 获取到value的keys
- 遍历keys，逐一调用`defineReactive(obj, key)`



### defineReactive

- new Dep()
- 获取该key的属性，如果该属性`configurable === false`，即key不可被改变。则直接返回
- 获取到原key定义的get和set函数
- 递归调用observe，获取其子观察者
- 改写其get和set方法
  - 给get添加依赖收集功能（`dep.depend()`）
  - 给set添加派发更新功能（`dep.notify()`） 



<!-- ### Dep

-  -->