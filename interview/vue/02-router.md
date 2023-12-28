# 路由相关

## 一句话即答

::: details 即答
|问题|答案|
|:-|:-|
|**在移动设备上不生效**|安装`babel-polyfill`插件|
|**页面如何重定向**|路由中配置`redirect`属性|
|**路由如何传参**|`this.$router.push({ name: 'components', params: { id: 'id' }})`|
|**如何接收参数**|`this.$route.query`或`this.$route.params`|
|**router-link上事件无效如何解决**|添加`.native`修饰符|
|**IE和火狐中路由不跳转**|① 使用`a`标签，② 使用`button`标签和`router.navigate`方法|
|**如何配置404页**|在路由表最后配置通配符`*`，然后引入`404`组件即可|
|**如何获取到当前的路由信息**|`this.$route.path` 或者`this.$router`|
|**history模式要注意什么**|① nginx配置，② 404页面要重定向到`index.html`|
:::

## 路由钩子

### 简述

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步的，此时导航在所有守卫`resolve`完成之前一直处于等待中。守卫方法接收以下三个参数

- `to` 即将要进入的路由目标
- `from` 当前导航正要离开的路由
- `next` 进行管道中的下一个钩子，如果钩子全部执行完毕，则导航的状态就是`confirmed`（确认的）。需要注意全局后置守卫不需要`next`函数

<br>

在`next`钩子中可以传以下几个参数

- `next(false)` 中断当前的导航，如果URL发生了变化，那么URL会重置到`from`路由对应的地址
- `next('path')` 要跳转的路由地址，比如`next('/')`或者`next({ path: '/' })`。当前导航被中断，然后进行新的导航。可以向next传递任意位置对象，还允许设置`replace: true`、`name: 'home'`之类的选项
- `next(error)` 传入`error`，则该导航会被终止且错误会被传递给`router.onError()`注册过的回调函数

要确保调用了`next`方法，否则钩子就不会被`resolved`

### 钩子分类

#### 全局

**全局前置守卫 beforeEach()**

```js
router.beforeEach((to, from, next) => {})
```

**全局解析守卫 router.beforeResolve()**

```js
router.beforeResolve((to, from, next) => {})
```
目前来看暂时与前置守卫没有什么不同

**全局后置守卫 afterEach()**

```js
router.afterEach((to, from) => {})
```

#### 路由内部独享钩子

**路由独享钩子 beforeEnter**

```js
const router = new VueRouter({
  routes: [{
    path: '/foo', component: Foo,
    beforeEnter: (to, from, next) => { }
  }]
})
```

#### 组件路由钩子

```js
const Home = {
  template: `<div>HOME</div>`,
  beforeRouteEnter(to, from, next){},
  beforeRouteUpdate(to, from, next){},
  beforeRouteLeave(to, from, next){}
}
```

- `beforeRouteEnter` 在渲染该组件的对应路由被`confirm`前调用。不能获取组件实例`this`，因为当守卫执行前，组件实例还没被创建
- `beforeRouteUpdate` 在当前路由改变，但是组件被复用时调用。比如使用`动态参数`的路由，在不同参数间进行跳转的时候。可以获取组件实例`this`。因为`this`已够用，所以`next()`不支持传递回调
- `beforeRouteLeave` 导航离开该组件对应的路由时调用，可以访问组件实例`this`。因为`this`已够用，所以`next()`不支持传递回调


离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过`next(false)`来取消。比如以下代码

```js
beforeRouteLeave (to, from , next) {
  const answer = window.confirm('还未保存，确认离开吗')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

## 基础问题

### 路由切换后页面跳转后新页面滚动位置不变

```js
export default {
  watch:{
    '$route': function(to,from) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  }
}
```


### 什么是异步组件

只需要一个在组件中返回一个promise对象即可。该回调函数会在你从服务器得到组件定义的时候被调用

**官方示例**

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    resolve({ template: '<div>I am async!</div>' })
  }, 1000)
})
```

### 如何引入异步组件（按需加载、路由懒加载

```js
// router.js
// webpack < 2.4
components: resolve => require(['../views/name.vue'],resolve)
// webpack > 2.4
component: () => import('../views/name.vue')

// vue文件内
componets: { model: () => import('./model') }
```

### 针对场景按需设置组件缓存

1. 进入页面后进行缓存。需要在元数据中进行设置，然后`push`进`include`
2. 离开后进行缓存。使用`deepth`来判断是前进还是后退

```js
watch: {
  $route(to, from) {
    if (to.meta.keepAlive) {
      !this.include.includes(to.name) && this.include.push(to.name)
    }
    if (from.meta.keepAlive && to.meta.deepth < from.meta.deepth) {
      const index = this.include.indexOf(from.name)
      index !== -1 && this.include.splice(index, 1)
    }
  }
}
```

### vue-router如何响应路由参数的变化

用`watch`监测，当监测的路由发生变化时执行

```js
watch: {
  $route(to, from){
    if(to != from) {
      // 对路由变化做出响应
      console.log("监听到路由变化，做出相应的处理")
    }
  }
}
```

### router和route的区别

- `router` 是`vue-router`的实例，导航到不同URL，需要使用`router.push`方法
- `route` 是路由对象，每个路由都有相应的路由对象，包含`path`、`name`、`meta`、`params`、`query`等对象，比如使用`this.$route.params`获取`params`参数
- `routes` 是路由对象数组，用于配置多个route路由对象


### $router的常用方法

- `$router.push()` 添加记录，可以前进后退
- `router.replace()` 跳转指定路径，会替换当前页面，常见于权限验证。
- `router.go(n)` 表示前进或后退多少页


### 路由的两种模式

#### 1. hash模式


1. `url`路径会出现`#`号字符
2. `hash`值不包括在`Http请求`中，它是交由前端路由处理，所以改变`hash`值时不会刷新页面，也不会向服务器发送请求
3. `hash`值的改变会触发`hashchange`事件

#### 2. history模式

1. 整个地址重新加载，可以保存历史记录，方便前进后退
2. 依赖`H5 API`和后台配置，没有后台配置的话，页面刷新时会出现`404`

### 两种模式的实现原理

#### 1. hash

基于`location.hash`，哈希值只是客户端的一种状态，所以当向服务器发送请求时，哈希部分不会被发送。每次哈希值改变都会在浏览器访问记录中增加一条记录，一次可以通过浏览器的返回、前进等按钮空值hash的切换

可以通过`a`标签，并设置`href`属性，当用户点击这个标签后，`URL`的`hash`值会发生改变。或者直接对`loaction.hash`进行赋值，改变hash。可以使用`hashchange`事件来监听`hash`值的变化，从而对页面进行跳转


#### 2. history

H5提供了`History API`来实现`URL`的变化。需要`API`有两个，`history.pushState()`和`history.repalceState()`。这两个api可以在不进行刷新的情况下操作浏览器的历史记录。而不同在于`pushState`是新增，`repalceState`是替换



### 如何动态添加路由

使用`addRoutes`函数

```js
let routerObj=new VueRouter({
	routes:[
		{path:'/a',component:a,name:'一号'},{path:'/b',component:b,name:'二号'}
	]
})
routerObj.addRoutes([
	{path:'/c',component:c,name:'三号'},{path:'/d',component:d,name:'四号'}
])
```

### vue-router完整的导航解析流程

1. 导航被触发
2. 在失活的组件里调用`beforeRouteLeave`守卫
3. 调用全局前置守卫`beforeEach`
4. 在重用的组件里调用`beforeRouteUpdate`或路由配置的`beforeEnter`
5. 解析异步路由组件
6. 在被激活的组件里调用`beforeRouteEnter`
7. 调用全局的`beforeResolve`
8. 导航被确认
9. 调用全局的`afterEach`钩子
10. 触发DOM更新
11. 用创建好的实例调用`beforeRouteEnter`中传给`next`的回调函数。


### Vue-router跳转和location.href有什么区别？

1. vue-router使用`pushState`进行路由更新，静态跳转，页面不会重新加载；`location.href`会触发浏览器，页面重新加载一次
2. vue-router使用diff算法，减少dom操作
3. vue-router是路由跳转或同一个页面跳转，location.href是不同页面跳转
4. vue-router是异步加载，location.href是同步加载


## eventBus

### EventBus注册在全局上时，路由切换时会重复触发事件，如何解决呢

在组件内的beforeRouteLeave中移除事件监听

或者在created里注册，在beforeDestroy中移出