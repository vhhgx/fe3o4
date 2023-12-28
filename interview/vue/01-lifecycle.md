# 生命周期相关

生命周期中有多个事件钩子，让我们在控制整个Vue实例的过程时更容易形成更好的逻辑。

## 生命周期的几个阶段

vue实例从创建到销毁，也就是从开始创建、初始化数据、编译模板、挂载Dom->渲染、更新->渲染、卸载的过程。分为`创建`、`挂载`、`更新`、`销毁`四个过程

### 创建

**1. beforeCreate** <br>
在`new Vue()`触发后的第一个钩子，当前阶段data、methods、computed及watch都不能被访问。只添加了一些默认事件

**2. created** <br>
`data`和`methods`初始化完毕，已经完成了数据观测。可以在该声明周期调用`methods`的方法或操作`data`中的数据。但无法操作dom，有需要可以使用`vm.$nextTick`方法


### 挂载

**3. beforeMount** <br>
`template`已经编译成为了`render`函数，`虚拟dom`已经创建完成。`$el`和`data`都初始化完毕，但还没挂载到页面中

**4. mounted** <br>
`Vue`实例初始化完成。`真实dom`已挂载，数据完成了双向绑定，可以在该生命周期操作dom节点，`vm.$el`可以调用


### 更新

**5. beforeUpdate** <br>
响应式数据进行更新，在`虚拟dom`重新渲染之前被触发，可以在该阶段更改数据。不会重新渲染

**6. updated** <br>
`data`和页面显示的数据同步完成，需要避免在此阶段更改数据。有可能会造成无限循环的更新


### 销毁

**7. beforeDestroy** <br>
`Vue`实例从运行阶段进入到了销毁阶段，该周期所有的`data`、`methods`、`指令`和`过滤器`等都是可用状态，还没有真正被销毁。要在该阶段销毁定时器和绑定事件

**8. destroyed** <br>
组件已经被销毁了，数据绑定被卸除，监听移出。子实例也被销毁

<!-- errorCaptured（2.5.0+ 新增):当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。 -->

<!-- beforeCreate和created之间会挂载Data，绑定事件；接下来会根据el挂载页面元素，如果没有设置el则生命周期结束，直到手动挂载；el挂载结束后，根据templete/outerHTML(el)渲染页面；在beforeMount前虚拟DOM已经创建完成；之后在mounted前，将vm.$el替换掉页面元素elmounted将虚拟dom挂载到真实页面（此时页面已经全部渲染完成）；之后发生数据变化时触发beforeUpdate和updated进行一些操作；最后主动调用销毁函数或者组件自动销毁时beforeDestroy，手动撤销监听事件，计时器等；destroyed时仅存在Dom节点，其他所有东西已自动销毁。这就是我所理解的vue的一个完整的生命周期； -->




## 父子组件相关

### 父子组件的生命周期顺序

组件的调用顺序都是先父后子,渲染完成的顺序是先子后父。
组件的销毁操作是先父后子，销毁完成的顺序是先子后父。


**加载渲染过程** <br>
`父beforeCreated` -> `父created` -> `父bedoreMount` -> `子beforeCreated` -> `created` -> `子bedoreMount` -> `子mounted` -> `父mounted`

**子组件更新过程** <br>
- 影响到父组件：`父beforeUpdate` -> `子beforeUpdate` -> `子updated` -> `父updated`
- 不影响父组件：`父beforeUpdate` -> `父updated`

**父组件更新过程** <br>
- 影响到子组件：`父beforeUpdate` -> `子beforeUpdate` -> `子updated` -> `父updted`
- 不影响子组件：`父beforeUpdate` -> `父updated`

**销毁过程** <br>
`父beforeDestroy` -> `子beforeDestroy` -> `子destroyed` -> `父destroyed`


### 父组件如何监听子组件的生命周期

父组件引用子组件时，通过`@hook`来监听

**父组件**

```html
<Child @hook:mounted="fns"></Child>
```

```js
fns() { console.log('父组件监听子组件mounted钩子') }
```

**子组件**

```js
mounted(){ console.log('子组件触发 mounted 钩子') }
```



<!-- 更新阶段
只有数据变化才会调用beforeUpdata和upDated，beforeUpdate执行表示el中的数据已经跟新完了，而updated触发时，表示el中的数据已经渲染完成，组件dom被更新。不能在update中修改响应数据`，要么就会形成死循环/



**src/shared/constants.js**中定义的所有可被开发者调用的钩子函数


const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
] -->


## 关于钩子

其实和回调是一个概念，当系统执行到某处时，检查是否有hook(钩子)，有的话就会执行回调。

### 第一次加载页面会触发哪几个钩子

`beforeCreate`、`created`、`beforeMount`、`mounted`

### 与keep-alive相关的生命周期

- `activated` 页面第一次进入的时候，钩子触发的顺序是`created->mounted->activated`
- `deactivated` 页面退出的时候会触发`deactivated`，当再次前进或者后退的时候只触发`activated`

使用`keep-alive`会将数据保留在内存中，如果要在每次进入页面的时候获取最新的数据，需要在`activated`阶段获取数据，承担原来`created`钩子函数中获取数据的任务


### watch和created那个先执行

如果在watch中设置了`immediate: true`，则会优先执行watch。否则先执行created

官网的生命周期图中，init reactivity是晚于beforeCreate但是早于created的。
watch加了immediate，应当同init reactivity周期一同执行，早于created。
而正常的watch，则是mounted周期后触发data changes的周期执行，晚于created。


<!-- 1）vm.$forceUpdate
作用： 强迫Vue.js实例重新渲染，仅仅影响实例本身及插槽内容的子组件，而不是所有的子组件。
（2）vm.$destory
作用： 完全销毁一个实例，清理该实例与其他实例的连接，并解绑其全部指令和监听器，同时触发beforeDestory和destroyed钩子函数。
（3）vm.$nextTick
作用： 将回调延迟到下次DOM更新循环之后执行，在执行数据后立即执行，然后等待DOM更新。
（4）vm.$mount
作用： 如果Vue实例在实例化时没有收到el选项，则它处于"未挂在"状态，用vm.$mount()手动地挂载一个未挂载的实例。 -->

