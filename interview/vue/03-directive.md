# Vue自身api相关

## 指令相关

### v-on 事件监听器

给元素绑定监听事件，简写为`@`

**修饰符**

- `.stop` 调用event.stopPropagation()，禁止事件冒泡。阻止事件继续传播
- `.prevent` 调用event.preventDefault()，阻止事件的默认行为
- `.capture` 添加事件侦听器时使用capture模式
- `.self` 只当事件是从侦听器绑定的元素本身触发时才触发回调
- `.once` 只触发一次回调
- `.passive` 以`{ passive: true }`模式添加侦听器
- `.native` 监听组件根元素的原生事件
- 

**按键修饰符**

作用于`v-on:keyup`，敲击响应按键触发回调，比如`v-on:keyup.enter="submit"`即为敲击回车后触发`submit`方法

还有其他按键修饰符`.enter`、`.tab`、`.delete`、`.esc`、`.space`、`.up`、`.down`、`.left`、`.right`

可以通过全局`Vue.config.keyCodes`对象自定义按键修饰符别名，比如下面的例子

```js
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```



### 自定义指令的钩子函数

- `bind` 当把指令绑定到dom元素身上的时候就会执行，在这里可以进行一次性的初始化设置
- `inserted` 被绑定的元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）
