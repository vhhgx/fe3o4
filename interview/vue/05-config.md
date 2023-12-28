# 配置相关问题



## vue的错误处理方法

分为errorCaptured和errHandler

errorCaptured是组件内部钩子，可捕捉本组件与子孙组件抛出的错误，接收error、vm、info三个参数，return false后可以阻止错误继续向上抛出。
errorHandler为全局钩子，使用Vue.config.errorHandler配置，接收参数与errorCaptured一致，2.6后可捕捉v-on与promise链的错误，可用于统一错误处理与错误兜底。

## babel

### babel的作用

转换语法，而不转换新的`api`。比如`iterator`、`generator`、`set`、`maps`、`proxy`等。新api就需要其他的babel模块进行转换


### assets和static的区别

这两个都是用来存放项目中所使用的静态资源文件。
两者的区别：
assets中的文件在运行npm run build的时候会打包，简单来说就是会被压缩体积，代码格式化之类的。打包之后也会放到static中。
static中的文件则不会被打包。

建议：将图片等未处理的文件放在assets中，打包减少体积。而对于第三方引入的一些资源文件如iconfont.css等可以放在static中，因为这些文件已经经过处理了。


## 网速慢时初始化页面  页面闪动

出现该问题是因为在 Vue 代码尚未被解析之前，尚无法控制页面中 DOM 的显示，所以会看见模板字符串等代码。 解决方案是，在 css 代码中添加 v-cloak 规则，同时在待编译的标签上添加 v-cloak 属性：

在div标签上添加 v-cloak

再在css中加一句 

`[v-cloak]{ display:none }`

```html
<div v-cloak>
  {{ message }}
</div>
```

## 如何修改vue打包后的生成文件路径

在`vue.config.js`中设置outputDir


这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，也可以用在类似 Cordova hybrid 应用的文件系统中。



## devServer
本地开发服务器配置，此处直接贴上我常用的配置，以注释的方式介绍

```js
devServer: { 
    //配置开发服务器
    host: "0.0.0.0",
    //是否启用热加载，就是每次更新代码，是否需要重新刷新浏览器才能看到新代码效果
    hot: true,
    //服务启动端口
    port: "8080",
    //是否自动打开浏览器默认为false
    open: false,
    //配置http代理
    proxy: { 
      "/api": { //如果ajax请求的地址是http://192.168.0.118:9999/api1那么你就可以在jajx中使用/api/api1路径,其请求路径会解析
        // http://192.168.0.118:9999/api1，当然你在浏览器上开到的还是http://localhost:8080/api/api1
        target: "http://192.168.0.118:9999",
        //是否允许跨域，这里是在开发环境会起作用，但在生产环境下，还是由后台去处理，所以不必太在意
        changeOrigin: true,
        pathRewrite: {
            //把多余的路径置为''
          "api": ""
        }
      },
      "/api2": {//可以配置多个代理，匹配上那个就使用哪种解析方式
        target: "http://api2",
        // ...
      }
    }
},
```


## vue打包后静态资源图片失效（部署至服务器报404）

图片失效：在`vue.config.js`文件中将assetsPublicPath属性由 `/`改为`./`
404：检查项目资源文件和服务器路径是否一致。或是否使用了history模式

## 动态设置img的src不生效

`<img :src="require('../../../assets/images/xxx.png')" />`


## axios相关

### axios同时请求多个接口，如果当token过期时，怎么取消后面的请求？

axios的话可以使用cancelToken来实现。如果是原生的XMLhttprequest的话，需要使用abort()方法实现。

```js
const CancelToken = axios.CancelToken
const source = CancelToken.source()
axios.get('/user/12345', {
cancelToken: source.token}).catch(
function(thrown) {
if (axios.isCancel(thrown)) {
console.log('Request canceled', thrown.message)
} else {
// 处理错误
}})
axios.post('/user/12345', { name: 'new name'}, { cancelToken: source.token}) // 取消请求（message 参数是可选的）source.cancel('Operation canceled by the user.')
```

## ajax、fetch、axios三者的区别

ajax就是xmlHttpRequest。
fetch内部返回一个promise，是基于xmlHttpRequest的封装
axios也是基于xmlHttpRequest的封装，返回一个promise


### 做过哪些优化


#### 代码层面

1. `v-if`和`v-show`区分使用场景
2. `computed`和`watch`区分使用场景
3. `v-for`和`v-if`避免同时使用
4. 事件的销毁
5. 图片懒加载
6. 路由懒加载、路由`webpack`分组
7. 按需引入第三方插件
8. 使用`Object.freeze()`冻结数据
9. 分屏加载（按照屏幕高度区分模块

#### Webpack层面

1. `Webpack`对图片进行压缩
2. 提取公共代码
3. 提取组件的`css`

#### 其他

1. 开启`gzip`压缩
2. 浏览器缓存
3. 使用cdn
4. 静态资源单独域名
5. 利用webpack中的externals这个属性把打包后不需要打包的库文件都分离出去，减小项目打包后的大小



## 如何解决vendor过大的问题

所有在main.js中引入的node_modules第三方包都会打包到chunk-vender.js中。所以很容易就出现文件过大的问题

1. 创建vue.config.js文件
2. 安装插件 `npm install --save-dev compression-webpack-plugin@6.0.0`
3. 然后在config中写入下面的内容

::: details 解决vendor过大问题
```js
const path = require('path')

const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@i': path.resolve(__dirname, './src/assets'),
      }
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // 下面是下载的插件的配置
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5,
        minChunkSize: 100
      })
    ],
		// 开启分离 js
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    }
  }
}
```
:::

然后在服务端配置Nginx


::: details 服务端配置
```bash
server{
	listen 8088
	server_name localhost
	
	# compression-webpack-plugin 配置
	gzip on
	gzip_min_length 1k
	gzip_comp_level 9
	gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png
	gzip_vary on
	# 配置禁用 gzip 条件，支持正则，此处表示 ie6 及以下不启用 gzip（因为ie低版本不支持）
	gzip_disable "MSIE [1-6]\."
}
```
:::


前端将文件打包成.gz文件。然后通过nginx配置，让浏览器直接解析.gz文件



1. 使用路由懒加载
2. 开启gzip
3. 使用cdn


编码阶段

尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcherv-if和v-for不能连用如果需要使用v-for给每项元素绑定事件时使用事件代理SPA 页面采用keep-alive缓存组件在更多的情况下，使用v-if替代v-showkey保证唯一使用路由懒加载、异步组件防抖、节流第三方模块按需导入长列表滚动到可视区域动态加载图片懒加载
SEO优化

预渲染服务端渲染SSR
打包优化

压缩代码Tree Shaking/Scope Hoisting使用cdn加载第三方模块多线程打包happypacksplitChunks抽离公共文件sourceMap优化
用户体验

骨架屏PWA





## vue-loader作用是什么

解析和转换`.vue`文件，提取出其中的逻辑代码 script、样式代码 style、以及 HTML 模版 template，再分别把它们交给对应的 Loader 去处理。

## vue-loader在webpack编译流程中的哪个阶段

模板编译阶段，从入口文件出发，调用所有配置的Loader对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

## 封装过axios吗，可以讲一下思路吗

统一上下文请求路径、统一超时时间、统一错误处理和拦截发送请求用于添加token

封装处理配置（路径、时间、token）、统一管理接口、错误处理、不同形式的请求、消息提示、loading等。

用Promise在封装一次axios，并统一baseURL，超时时间，请求拦截，响应拦截处理，统一管理接口，批量导出。

## 如何中断axios的请求


## 如何解决跨域问题

1.CORS解决跨域问题，这需要通过后端来解决，通过设置header头来通配。使服务器允许跨域请求接口数据，而前端正常使用axios请求方式。
2.通过接口代理的方式，在vue项目中创建一个vue.config.js，导入一个devserve，并配置里面的选项即可。




## 性能优化

https://juejin.cn/post/6857856269488193549

- 利用v-if和v-show减少初始化渲染和切换渲染的性能开销
- computed、watch、methods区分使用场景
- 提前处理好数据解决v-if和v-for必须同级的问题
- 给v-for循环项加上key提高diff计算速度
- 利用v-once处理只会渲染一次的元素或组件
- 利用Object.freeze()冻结不需要响应式变化的数据
- 提前过滤掉非必须数据，优化data选项中的数据结构
- 避免在v-for循环中读取data中数组类型的数据
- 防抖和节流  https://juejin.cn/post/6857856269488193549#heading-10
- 图片大小优化和懒加载
- 组件库的按需引入


## 在使用vue-cli开发vue项目时，自动刷新页面的原理你了解吗

自动刷新页面并不是vue-cli的功能，而是webpack的hot-module-replacement-plugin插件在做这件事，这个插件是webpack自带的插件，用来做hmr的。如果需要配置hmr只需要在webpack.config.js的devServer字段写 下面的配置即可。
{
contentBase: 服务器可以访问的根目录,
hot:true, //开启热模块替换也就是hmr
hotOnly:true //不刷新页面，只做hmr
}
而由于vue-cli3集成了webpack的配置，所以vue.config.js里面也有这个属性，配置写法是一样的。


## vue-cli如何解决跨域的问题

vue-cli 主要在本地通过本地服务器拦截转发请求的模式解决跨域问题。

步骤：

config中设置proxy，这步决定哪种命名规则（比如'/abc/'开头的请求）的请求将被拦截（个人以为是通过改造XMLHttpRequest对象）到本地跨域服务器
本地服务器转发请求到目标服务器
本地服务器设置允许跨域的headers，然后返回结果，从而解决跨域
跨域问题，除了单机修改浏览器配置外，都是服务器端配合进行解决。

vue-cli无法解决跨域问题。真正解决跨域问的是webpack。只不过vue-cli3.0将webpack的配置继承到了vue.config.js中，才给初学者造成了vue-cli可以解决跨域的错觉。
与在webpack.config.js中配置跨域一样，在vue.config.js中的devServer:{proxy:{}}字段可以编写跨域配置。
具体的配置写法webpack文档写的很清楚。

## cli中经常用到的加载器（loader）有哪些

vue-loader/style-loader/sass-loader/url-loader...