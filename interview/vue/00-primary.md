# 基础问题


## 初始级别问题

### v-for和v-if的优先级

在源码`compiler/codegen/index.js`的`genElement`方法中`if..else`块逻辑。可看到for的判断在if判断之上，所以证明`v-for`的优先级高于`v-if`

**优化方式**

1. `v-if`在`v-for`外层
2. 可以将for的数组提前通过计算属性进行处理
3. 使用`v-show`

### v-if和v-show有什么区别

- `v-if`是真正的条件渲染，只有条件为真时才会进行渲染。
- `v-show`不管条件是什么都会先渲染，只是使用`css`的`display: none`进行切换

所以`if`适用于不频繁切换条件的场景，`for`适用于频繁切换条件的场景

### v-for按什么顺序遍历对象，如何保证顺序

1. 会先判断是否有`iterator`接口，如果有循环执行`next()`方法
2. 没有`iterator`的情况下，会调用`Object.keys`方法，在不同浏览器中，JS引擎不能保证输出顺序一致
3. 保证对象的输出顺序可以把对象放在数组中，作为数组的元素

### 单向数据流和双向数据流

- 单向：数据变化就去更新页面，
- 双向：数据变化或者用户操作，都会带来互相的变化

---



---

### watch和computed的实现

https://segmentfault.com/11111111111111                                                                                                                                                                                   1a/1190000010408657

---

### 什么是过滤器

是一种实现自定义文本格式的方法，可以在模板表达式中使用管道符进行调用，比如下面的

**template**

```html
<div>{{ title | reverse }}</div>
```

```js
filters: {
  reverse(text){
    return text.split("").reverse().join("")
  }
}
```

### 动态设置img不生效如何解决

因为动态添加src被当作静态资源处理了，没有进行编译，所以要加上require。`<img :src="require('../../../assets/images/xxx.png')" />`

### 如何扩展某个现有组件

1. 使用`Vue.extend`直接扩展
2. 使用`Vue.mixin`进行混入
3. 使用slot插槽

### vue变量名如果以_、$开头的属性会发生什么问题？怎么访问到它们的值

以`_`、`$`开头不会被`vue实例`所代理。因为有可能会和`vue`内置的属性和`api`冲突。可以使用`vm.$data._xxx`或`._data.xxx`进行访问

### 渲染大量数据应该如何优化

1. 需要响应式，可以只渲染要显示的数据
2. 不需要响应式，变量在`beforeCreated`或`created`中声明
3. 做分页
4. `Object.freeze`冻结，使其不能添加、修改和删除属性

### 定时器如何销毁

当生命周期结束后，并没有将组件中的计时器销毁。如果不主动销毁，容易造成内存泄漏

```js
const timer = setInterval(() =>{}, 1000)
// 通过$once来监听定时器，在beforeDestroy钩子可以被清除
this.$once('hook:beforeDestroy', () => {
  clearInterval(timer)
})
```

### 如何强制刷新组件

强制重新渲染`this.$forceUpdate()`

强制刷新某组件

```html
<SomeComponent :key="theKey"/>
```
```js
// 在options中绑定data
data(){
  return{
		theKey:0
  }
}
// 然后刷新key以达到刷新组件的目的
theKey++
```

### 给组件绑定的自定义事件无效怎么解决

1. 添加.native修饰符
2. 组件内声明$emit('自定义事件')

### delete和Vue.delete删除数组的区别

`delete`只是被删除的元素变成了`empty/undefined`其他的元素的键值还是不变。`Vue.delete`直接删除了数组，改变了数组的键值。对象是响应式的，确保删除能触发更新视图，这个方法主要用于避开 Vue 不能检测到属性被删除的限制）

### 如何动态绑定class、style

```html
<!-- 数组形式，isActive为true即可生效 -->
<div :class="{'orange': isOrange, 'green': isGreen}">对象形式</div>
<div :class="['btn', 'primary']">数组形式</div>
<!-- style -->
<div :style="{color: color, fontSize: fontSize + 'px' }">对象形式</div>
```

### 为何要求组件模板只能有一个根元素

组件的`template`最终会转换成`vnode`对象。如果有多个根元素，就会在转换的时候发生混乱。降低性能。

如果真出现了有多个根元素的情况，说明该组件需要解耦。拆解成多个组件

### 给vue定义全局方法

1. 挂载到`Vue.prototype`上
2. 通过`mixin`混入的方式
3. 通过Vue插件`Vue.use(plugin)`。但该方法没有挂载的功能。只是触发了插件的install方法。本质还是使用了vue.prototype

### 为何key不推荐使用随机数或index

为了更高效的更新`vnode`。在`vdom`的`patch`过程中，`updateChildren`函数会调用`someVnode`函数。`sameVnode`函数需要比较`key`。如果`key`一样可以直接进行复用，减少渲染时的性能损耗

如果使用index的话，修改数组的值vue则无法判断哪一项进行了更新。会重新渲染。增加了性能损耗

### vue中如何重置data

使用`Object.assign(vm.$data, this.$options.data())`，`vm.$data`可以获取当前状态下的`data`，`vm.$options.data`可以获取到组件初始化状态下的`data`

### data为何必须是一个函数

防止组件复用数据。因为对象为引用类型，重用组件时，由于数据对象都指向同一个data对象。所以修改一个组件中的data，其他重用的组件中的data会同时被修改。而data是函数，则每次返回的都是一个新对象，引用地址不同，便不会出现这个问题

### 如何快速定位出现性能问题的组件

可以使用timeline来查看每个函数的调用时长，定位出哪个函数的问题，从而判断哪个组件出了问题

<img src="https://images.unsplash.com/photo-1630182046438-2b6b4daf6380?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2700&q=80"  style="width: 1920px"/>

### 如何批量引入组件

#### 1. 全局引入

创建一个js文件，然后在main.js中引入

```js
// 参数分别是
// 组件所在目录的相对路径，是否查询其子目录，匹配基础组件文件名的正则表达式
const requireComponent = require.context( './', false, /Base[A-Z]\w+\.(vue|js)$/ )
requireComponent.keys().forEach(fileName=>{
  // 获取文件名
  var names = fileName.split("/").pop().replace(/\.\w+$/,"")
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 若该组件是通过"export default"导出的，优先使用".default"
  Vue.component(names, componentConfig.default || componentConfig)
})
```

#### 2. 局部引入

```html
<template>
  <div>
    <component v-bind:is="isWhich"></component>
  </div>
</template>
```

```js
// 组件所在目录的相对路径，是否查询其子目录，匹配基础组件文件名的正则表达式
const requireComponent = require.context( "./", true, /\w+\.vue$/ )
var comObj = {}
requireComponent.keys().forEach(fileName => {
  // 获取文件名
  var names = fileName.split("/").pop().replace(/\.\w+$/, "")
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 若该组件是通过"export default"导出的，优先使用".default"
  comObj[names] = componentConfig.default || componentConfig
})

export default {
  data() {
    return {
      isWhich: ""
    }
  },
  mounted() {},
  components: comObj
}
```


## 用于开场的废话

### vue的优点

1. 渐进式框架：没有多做职责之外的事情
2. 轻量级，只关注视图层
3. 双向数据绑定
4. 组件化，可重用
5. 低耦合，视图和数据分离
6. 虚拟dom


### 如何访问各种实例

1. 根实例：this.$root
2. 父组件的实例：this.$parent
3. 子组件的实例：this.$refs
4. 子元素：this.$children


### vue使用了哪些设计模式

1. 工厂模式，传入参数即可创建实例。比如`vdom`根据参数的不同返回`基础vnode`和`组件vnode`
2. 单例模式，整个程序有且只有一个实例。比如`vuex`和`vue-router`的`install`方法。如果存在实例就直接返回
3. 观察者模式，响应式数据的原理
4. 发布订阅模式，vue的事件机制