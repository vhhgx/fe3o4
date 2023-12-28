# HTML & CSS 基础问答题






## BFC是什么

块级格式化上下文，是一块独立的渲染区域。

**触发BFC的条件**

- float非none
- position为absolute或fixed
- display为flex或inline-block

## em和rem相关








------------------------------------- 上面是新的 -------------------------------------


- 响应式布局  如何实现响应式

- dom的事件模型，事件冒泡和事件捕获
  - 事件委托
  - 都有哪些事件


## 事件冒泡是什么，如何阻止

## 如何解决margin塌陷





## 渲染什么情况会阻塞

assistant: 浏览器在渲染页面时，可能会出现阻塞（Blocking）的情况，即在某些情况下，浏览器会停止页面渲染，等待某个操作完成后再继续渲染。以下是一些常见的阻塞情况：

1. CSS 和 JavaScript 文件的下载和解析：当浏览器下载和解析 CSS 和 JavaScript 文件时，会阻塞页面的渲染。这是因为浏览器在解析 CSS 和 JavaScript 文件时，需要等到这些文件下载完成、解析完成后，才能继续进行渲染。
2. 阻塞的 JavaScript 执行：当页面中的 JavaScript 执行时间过长时，会导致页面的渲染被阻塞。这是因为 JavaScript 代码执行时，会占用主线程，如果 JavaScript 代码执行时间过长，就会导致页面渲染的阻塞。
3. 大量的 DOM 操作：当页面中进行大量的 DOM 操作时，会导致页面的渲染被阻塞。这是因为 DOM 操作会引起页面的重新渲染和重排，如果进行过多的 DOM 操作，就会导致页面的渲染被阻塞。
4. 图像的下载和解码：当页面中包含大量的图像时，会导致图像的下载和解码也成为页面渲染的瓶颈。如果图像的下载和解码时间过长，就会导致页面的渲染被阻塞。
5. 使用了阻塞渲染的 CSS 属性：某些 CSS 属性会阻塞页面的渲染，例如 `position: fixed` 和 `width: calc()` 等。如果过多地使用这些阻塞渲染的 CSS 属性，也会导致页面的渲染被阻塞。

为了避免页面渲染被阻塞，我们可以采取以下措施：

1. 将 CSS 和 JavaScript 文件放在页面的底部，避免在页面渲染时阻塞主线程。
2. 尽量减少 JavaScript 代码的执行时间，可以通过代码优化、异步加载等方式来实现。
3. 减少 DOM 操作的次数，可以通过批量操作、使用虚拟 DOM 等方式来实现。
4. 使用合适的图像格式和压缩率，减少图像的下载和解码时间。
5. 避免使用阻塞渲染的 CSS 属性，尽量使用非阻塞渲染的属性。

总的来说，了解页面渲染的阻塞情况，可以帮助我们更好地优化页面性能，提高用户体验。

## 双向数据绑定的实现思路
assistant: 双向数据绑定是一种将视图层和数据层连接起来的方式，它使得在视图层的变化能够直接同步到数据层，同时数据层的变化也能够
user: vue中双向数据绑定的实现思路
assistant: 在 Vue 中，双向数据绑定是通过 `v-model` 指令实现的，它实际上是一个语法糖，它的本质是通过绑定 `value` 属性和 `input` 事件实现双向数据绑定。

在一个使用了 `v-model` 指令的表单元素中，`v-model` 实际上是一个简写的语法糖，例如：

```html
<input v-model="message">
```

上述代码实际上等价于：

```html
<input :value="message" @input="message = $event.target.value">
```

其中，`value` 属性和 `@input` 事件绑定了 `message` 变量，当用户在输入框中输入时，`input` 事件会被触发，更新 `message` 变量的值。当 `message` 变量的值发生变化时，`value` 属性也会相应地更新。

在 Vue 内部，双向数据绑定是通过 Object.defineProperty() 方法实现的。当 Vue 实例化时，会将数据对象传入 Vue 实例的一个 _data 属性中，然后遍历 _data 中的每个属性，对每个属性都调用一次 defineReactive() 方法，该方法会利用 Object.defineProperty() 方法，为该属性添加 getter 和 setter，并将该属性的值存储在一个闭包变量中。当属性的值发生变化时，setter 会被调用，进而通知视图进行更新。同时，当一个组件实例被销毁时，会调用 unwatch() 方法，以取消对该属性的监听。


3、如何设置这两种模型
//设置标准模型
box-sizing: content-box
//设置IE模型
box-sizing: border-box


标准模型是content的宽高   IE模型是所有内容的宽高  border、padding、content


4、页面导入样式时，使用link和@import有什么区别
写法上：

```
<link rel="stylesheet" href="路径" />

<style type="text/css">
    @import '路径'
</style>
```

本质上：link属于XHTML标签，除了加载css之外，还能定义RSS，定义rel连接属性等作用。而@import是css提供的，只能用于加载css
解析上：link是跟着页面加载同时加载的，但是@import会等到页面加载完再加载
兼容上：@import IE5以上才能识别，无限制


```
19、实现不使用 border 画出1px高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。
<div style="height:1pxoverflow:hiddenbackground:red"></div>
```

```

title与h1的区别、b与strong的区别、i与em的区别？
这个问题涉及到语义化的问题
title属性没有明确意义只表示是个标题，H1则表示层次明确的标题，主要影响的页面爬虫与SEO
strong是标明重点内容，有语气加强的含义，使用阅读设备阅读网络时：<strong>会重读，而<B>是展示强调内容。
```

### 文字两端对齐
text-align: justify


3、行内元素有哪些？块级元素有哪些？空（void）元素有哪些？
常见的行内元素有：a，b，span，img（我曾以为是block），input，strong，select
常见的块级元素有：div、ul（无序）、ol（有序）、li、p等
常见的空元素：<br><hr><link><script>
空元素定义：html元素的内容就是其两个标签之间的content，所以，标签之间没有内容的就是空元素


7、html5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分 HTML 和 HTML5？

绘画canvas

用于媒介回放的video和audio元素

本地离线存储localStorage，长期存储，浏览器关闭之后数据不丢失
sessionStorage的数据在浏览器关闭后自动删除

语意化更好的内容元素，比如 article、footer、header、nav、section

表单控件，calendar、date、time、email、url、search

新的技术webworker, websocket, Geolocation

移除的元素：
  纯表现的元素：basefont，big，center，font, s，strike，tt，u
  对可用性产生负面影响的元素：frame，frameset，noframes；


8、对html语义化的理解（了解）

用正确的标签做正确的事情。
html语义化让页面的内容结构化，结构更清晰，便于对浏览器、搜索引擎解析
搜索引擎的爬虫也依赖于HTML标记来确定上下文和各个关键字的权重，利于SEO
使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。


11、请描述一下 cookies，sessionStorage 和 localStorage 的区别？
cookie是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）。

cookie数据始终在同源的http请求中携带（即使不需要），记会在浏览器和服务器间来回传递。
sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。

存储大小：

cookie数据大小不能超过4k。
sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。

有期时间：

localStorage    存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
sessionStorage  数据在当前浏览器窗口关闭后自动删除。
cookie          设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭







12、iframe有那些缺点？

iframe会阻塞主页面的Onload事件；
搜索引擎的检索程序无法解读这种页面，不利于SEO
iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
使用iframe之前需要考虑这两个缺点。如果需要使用iframe，最好是通过javascript
动态给iframe添加src属性值，这样可以绕开以上两个问题。


iframe会阻塞主页面的Onload事件


13、Label的作用是什么？是怎么用的？
用来关联某个标签，可以是表单标签，也可以是button，这样就可以直接点击label的范围来触发绑定标签的事件



14、HTML5的form如何关闭自动完成功能？
自动完成：当你给输入框输入内容时，浏览器会从之前同名输入框的历史记录中查找出类似的内容并列在输入框下面。
给form或者该input设置autocomplete=off。
经过实验，提交之后，历史记录才会存储，当然，必须是name相同的input才会共享历史记录


列举HTML5新特性

语意化标签(nav、aside、dialog、header、footer等)
canvas
拖放相关api
Audio、Video
获取地理位置
更好的input校验
web存储(localStorage、sessionStorage)
webWorkers(类似于多线程并发)
webSocket

列举Css3新特性

选择器
边框(border-image、border-radius、box-shadow)
背景(background-clip、background-origin、background-size)
渐变(linear-gradients、radial-gradents)
字体(@font-face)
转换、形变(transform)
过度(transition)
动画(animation)
弹性盒模型(flex-box)
媒体查询(@media)

### link 与 @import 的区别

link功能较多，可以定义 RSS，定义 Rel 等作用，而@import只能用于加载 css
当解析到link时，页面会同步加载所引的 css，而@import所引用的 css 会等到页面加载完才被加载
@import需要 IE5 以上才能使用
link可以使用 js 动态引入，@import不行


### CSS 先记录在这里


什么是 BFC
内容盒子和 IE 盒子区别


- css3的新特性

```
新增各种css选择器
圆角 border-radius
多列布局
阴影和反射
文字特效text-shadow
线性渐变
旋转transform
```


- 新增的伪类
- 盒子模型
  - 两种盒子模型的区别

```
盒模型分两种： 怪异盒模型（IE）、标准盒模型（W3C）
盒模型：content、padding、margin、border
 
 **怪异盒模型（IE）**
     width/height包含了 padding、border
     width = content + padding + border
     height = content + padding + border
     盒子width = width + margin
     盒子height = height + margin
      
** 标准盒模型**
     width = content 
     height = content
     盒子width = width + padding + border + margin
     盒子height = height + padding + border + margin
     
**box-sizing可以改变盒模型** 
    是css3属性
    box-sizing：border-box；怪异模式（IE），盒子width包含 content + margin
    box-sizing：content-box；标准模式（W3C），盒子width包含 content + padding + border + margin
 **小结**
    开发中较多使用标准盒模型，在实际开发中怪异盒模型可解决盒子被撑大的问题。

```
- 定位
- 子选择器之类的
- BFC 查一下

```
块级格式化上下文，是一个独立的渲染区域，有自己的渲染规则，使内外元素不会相互影响，可以更好的控制文档流、处理浮动等问题。
```


promise 可以再看一下  https://juejin.cn/post/7300758264329240585?searchId=20231115144213E0CC0634811DB36331CD



inline元素、block元素、inline-block元素的区别：

块级元素会独占一行，而行内元素和行内块级元素则会在一行内显示。
块级元素和行内块级元素可以设置 width、height 属性，而行内元素设置无效。
块级元素的 width 默认为 100%，而行内元素则是根据其自身的内容或子元素来决定其宽度。




::before 和 ::after 中双冒号和单冒号有什么区别、作用（伪类和伪元素的区别）？

区别：

在CSS中 伪类 一直用 : 表示，如:hover、:active等；
伪元素在CSS1中已经存在，当时语法是用 : 表示，如:before、:after，后来在CSS3中修订， 伪元素 使用 :: 表示，如::before、::after（单冒号的写法依然可以生效）；
单冒号（:）用于CSS3的伪类；
双冒号（::）用于CSS3的伪元素；
想让插入的内容出现在其他内容的前面，使用::before，否则使用:after；
在代码顺序上，::after生成的内容也比::before生成的内容靠后；


作用：

::before 和 ::after 的主要作用是在元素内容的前后加上指定内容；
伪类 于 伪元素 都是用于向选择器加特殊效果；
伪类 于 伪元素 的 本质区别在于是否抽象的创建了新的元素；
伪类 只要 不是互斥 的就可以 叠加使用；
伪元素在一个选择器中只能出现一次，并且不能出现在开始和末尾；
伪类优先级 === 类优先级；
伪元素优先级 === 标签优先级；

作者：禁止摆烂_才浅
链接：https://juejin.cn/post/7306780139743903795
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


用CSS怎么然谷歌浏览器支持小于12px的文字？
针对谷歌浏览器内核，加webkit前缀，用 transform: scale()这个属性进行缩放；


vh/vw单位,与auto, 100%有什么区别
vh/vw: 视口大小占比, 与设备相关
auto: 为默认值, 通常与设备无关
100%: 受父容器的影响；


标签中的 title属性 和 alt属性 的区别是什么？

title：

是标签的描述，当鼠标移入时，稍等一会儿就会出现这个描述信息；


alt:

用在可置换元素上，当外部资源无法正确加载时，这个信息就会显示在占位符上；



7. 什么是置换元素 和 非置换元素，每种类型至少举出三个例子

置换元素：

置换元素的内容来自外部，该元素仅是外部资源的占位符；
<img>、<video>、<audio>...；


非置换元素：

非置换元素内容来自当前文档，必须使用双标签；
<p>、<h1> ~ <h6>、<ul>...；

作者：禁止摆烂_才浅
链接：https://juejin.cn/post/7306756690728730650
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


 iframe标签有什么优缺点？

优点：

重载页面时不需要加载整个页面，只需要重载页面中的一个框架页（减少数据的传输，加快了网页下载速度）；
技术易于掌握，使用方便，可主要使用于不需要搜索引擎来搜索的页面；
当前页面，直接加载其他页面，而不必发生跳转；


缺点：

iframe 会阻塞主页面中的 Onload 事件；
会产生很多页面，不容易管理；
多框架的页面会增加服务器的http请求，影响页面的并行加载；

并行加载：同一时间针对不同域名下的请求，iframe和所在页面在同一个域下面，而浏览器的并行加载的数量是有限制的；

作者：禁止摆烂_才浅
链接：https://juejin.cn/post/7306756690728730650
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


微前端（Microfrontend）是一种将前端应用分解为更小、更独立的部分的设计理念，每部分负责应用程序的一部分功能。使用iframe作为微前端架构的一部分有其独特的优缺点。

### 优点

1. **隔离性**：iframe提供了很强的隔离性，每个微前端应用在自己的iframe中运行，不会影响到其他应用或主应用。
2. **独立部署**：每个微前端可以独立部署和更新，不需要重新部署整个应用。
3. **技术栈独立**：每个微前端应用可以使用不同的技术栈，因为iframe内部的实现对外部是透明的。
4. **安全性**：由于iframe的隔离特性，可以防止跨站脚本攻击（XSS）。

### 缺点

1. **性能开销**：每个iframe都是一个完整的文档环境，会有额外的内存和性能开销。
2. **样式和布局挑战**：iframe内部的内容样式可能需要单独处理，与主应用的样式统一可能较困难。
3. **跨iframe通信问题**：iframe之间的通信较为复杂，需要特定的机制来实现数据和事件的传递。
4. **SEO问题**：对于需要搜索引擎优化的应用，iframe可能不是最佳选择，因为搜索引擎可能不会有效索引iframe中的内容。
5. **用户体验**：iframe可能导致用户体验问题，如滚动问题、导航问题等。

在考虑使用iframe作为微前端解决方案的一部分时，需要权衡这些优缺点，并根据应用的具体需求做出决策。在一些场景下，其他微前端实现方式（如Web组件、JavaScript库或框架的模块化系统）可能是更好的选择。




### 为何使用rem单位的网站字体会随页面宽度增大而放大，该如何避免此现象？

当使用 `rem` 作为字体大小的单位时，字体大小是相对于根元素（即 HTML 元素）的字体大小的。如果根元素的字体大小与视口宽度挂钩，那么当视口宽度变化时，使用 `rem` 单位的字体大小也会相应变化。

为了避免这种情况，你可以采取以下几种方法：

1. **固定根元素字体大小**：在 CSS 中直接为根元素设置一个固定的字体大小，例如：
   ```css
   html {
       font-size: 16px
   }
   ```
   这样，无论视口宽度如何变化，使用 `rem` 单位的元素字体大小都不会改变。

2. **使用媒体查询来控制根元素字体大小**：如果你想在不同的屏幕尺寸下有不同的字体大小，但又不想它随着窗口的拉伸而持续变化，可以使用媒体查询来为不同的屏幕宽度设置不同的根元素字体大小。例如：
   ```css
   html {
       font-size: 16px
   }

   @media (min-width: 600px) {
       html {
           font-size: 18px
       }
   }

   @media (min-width: 1000px) {
       html {
           font-size: 20px
       }
   }
   ```
   这样，在不同的断点下，你可以控制字体的大小，但在断点之间字体大小不会变。

3. **避免在根元素上使用百分比或视窗单位**：有时候，根元素的字体大小可能被设置为相对于视窗的宽度的一个百分比（如 `vw` 单位）。这会导致字体大小随着视窗宽度的变化而变化。避免使用这样的单位可以防止 `rem` 单位的字体大小随之变化。

通过这些方法，你可以有效控制使用 `rem` 单位的元素的字体大小，使其不会随着页面宽度的变化而变化。


- parent元素宽高不定，实现scale固定宽高比始终为4：3


- 一些css动画
- - 垂直居中的几种方案


CSS 重叠样式表，重叠怎么理解
Vue 的 diff 和 React 的 diff 有什么不同
虚拟 Dom 是什么，为什么要用虚拟 Dom
为什么很多框架采用无虚拟 Dom，例如 svelte
为什么浏览器只有 body 在界面展示，head 这部分在浏览器中是什么处理的
如果后端一直返回数据，需要对 table 进行数据展示要怎么来设计，需要考虑内存储存不够场景
css 动画为什么比 js 动画流畅
怎么实现组件库的整体引用和分别引用，对于 css 样式怎么来实现呢？
时间切片是什么，为什么 Vue 没有使用
Vue 为什么有静态提升
- v3的hook
nextTick 的实现原理