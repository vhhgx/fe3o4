# 前端工程化问题

## 说说webpack编译打包的流程

- 先读取配置文件中的配置，比如不同文件格式所使用的loader和配置等
- 然后从入口文件entry开始，分析项目结构，识别模块之间的依赖关系
- 通过loader将不同类型的文件进行处理，
  - 将js转换为ast是babel-loader借助babel这个插件完成的
    - babel是一个js的编译器，会将源代码转换为ast，然后再将ast转换为js代码
    - babel-loader是一个桥梁，允许webpack使用babel进行文件的转换
    - 需要安装babel相关的包，例如 @babel/core、@babel/preset-env 等。
    - core是babel的核心库，负责ast的转换逻辑
    - Babel 的工作流程:
```
        当 Webpack 处理 JavaScript 文件时，它会调用 babel-loader。
        babel-loader 接收到文件内容后，调用 Babel 的 API。
        Babel 首先解析代码，生成 AST。
        接着，Babel 根据配置的预设（presets）和插件（plugins）对 AST 进行操作，如语法转换、特性降级等。
        最后，Babel 将处理后的 AST 转换回 JavaScript 代码。
```

```js
// npm install --save-dev babel-loader @babel/core @babel/preset-env

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
};
```



  - 转换为ast之后就可以进行依赖管理
  - NOTE 这里的问题是什么loader先执行，预设的loader和配置文件中的loader的先后执行顺序是什么
  - loader会把其他类型的文件转换成webpack可以处理的模块
    - NOTE 这里webpack可以处理的模块是什么东西
    - 如果处理图片的话，一般会使用file-loader或url-loader。这些加载器会把图片文件转换为合适webpack处理的饭碗吗
- 然后webpack会执行配置的插件，插件会执行一些任务，比如优化，压缩，或者重新定义环境变量等等。或生成一些文件
- 输出：loader和webpak处理完成后，wp会根据配置把所有模块打包成一个或多个bundle，然后输出到指定的目录


```js
// 比如使用file-loader这个插件
module.exports = {
  // ...其他配置
  module: {
    rules: [
      // ...其他规则
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // 10kB 以下的文件使用 url-loader
          name: 'img/[name].[hash:7].[ext]' // 文件命名规则
        }
      }
    ],
  },
};
```



其转换的过程

```js
// a.js
export function func() {
  console.log("Hello from a.js");
}

// b.js
import { func } from './a.js';
func();
```


打包之后的文件差不多会变成下面的样子

```js
(function(modules) { // webpackBootstrap
  // Webpack 模块缓存
  var installedModules = {};

  // require 函数
  function __webpack_require__(moduleId) {
    // 检查模块是否在缓存中
    if(installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // 创建一个新模块，并放入缓存中
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // 执行模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // 标记模块为已加载
    module.l = true;

    // 返回模块的导出
    return module.exports;
  }

  // 加载入口模块并返回导出
  return __webpack_require__(__webpack_require__.s = "./b.js");
})
({
  "./a.js": (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_exports__["a"] = (func);
    function func() {
      console.log("Hello from a.js");
    }
  }),

  "./b.js": (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var _a_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./a.js");
    Object(_a_js__WEBPACK_IMPORTED_MODULE_0__["a" /* func */])();
  })
});
```


其中的chunk，是代码块的概念，表示在打包过程中，源码被分割成不同的块，可以是不同的入口文件，或者由于懒加载而分离出来的代码块

chunk_assets是chunks生成的文件，是打包的最终产物

应该是配置中的参数或者变量，会将处理后的文件输出到指定的目录，是编译过程的最后一步

而bundle是webpack最终的输出文件，一个bundle包含了经过优化和编译的代码，通常是多个chunk的合并

在一个bundle中，通常包含一个或多个chunk，简单配置中可能只有一个，但更复杂的配置中，则会产生多个chunk，但最终可能会合并成一个bundle

webpack对图片和css的处理

- 对于css
  - 通常使用style-loader和css-loader将其转换为js模块，如果希望将css提取到单独的文件中，则需要使用mini-css-extract-plugin 插件

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // ...其他配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // ...其他规则
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
```


在plugins中的apply方法，是插件的主要方法，会被webpack编译器（也就是compiler）调用

compiler对象，是webpack的主要引擎，管理着打包的整个过程，当apply方法被调用的时候，会接收一个compiler对象作为参数，

在webpack的生命周期中，可以有多个编译（compilation），每次重新编译或者监视到文件变化时，都会产生一个新的compilation


webpack的配置中，有一个context属性用于设置项目的基础目录



渡一讲的 其编译过程

先初始化，然后再进行编译，然后输出



初始化的时候会把cli的参数、配置文件还有默认配置进行融合。然后通过入口来创建不同的代码块，译为chunk

TODO 这里的chunk和vue中路由表里的chunkName的关系是什么，如何在webpack的配置中去设置不同的块

TODO 有多个chunk的话，chunk的属性是什么，chunk的name属性是如何设置的


渡一的视频讲的是默认只有一个块的话，name默认为main，id在生产环境为从0开始的数字，其他环境则与name相同




在入口的index中会先检查记录，记录就是检查该模块是否被加载过，模块的id就是其路径。没加载过的话，就用loader进行处理，然后babel-loader调用babel将代码转换为js的抽象语法树 ast

分析这个文件中哪里引入了依赖，将这些依赖进行记录。好像是一个dependencies的数组，元素为完整的相对路径

然后把进行导入语句一些替换，比如import等导入语句替换为__webpack_require('xxxx')



然后产生chunk_assets，根据配置生成资源列表。

TODO：这里是如何生成chunk_assets的，又如何合并的









<!-- wp会自动进行依赖分析，将源码构建在同一个文件中 -->




## webpack与rollup、vite



## webpack中plugin和laoder的区别，它们的执行时机，以及常用的plugin和loader

## 说一下对tree-shaking的了解，对CommonJS和ESM都可以用tree-shaking吗

一个编译时的优化步骤，用于移除模块中未引用的代码。基于es6模块的静态结构特性，所以工具可以在编译的过程中确定哪些导出使用了，哪些没有。没有使用的就会被标记，在最终的打包代码中被移除。

对于cjs模块，由于cjs是运行时的动态模块，所以较难确认哪些没被使用。webpack和rollup对其进行了一些优化支持，但效果可能有限

## css-loader的作用是什么？不使用css-loader行不行

## vite和webpack的区别


## wp的构建流程，如何利用优化性能（性能

## 提升wp构建速度、减小构建体积

## 代码风格控制，eslint、pritter等

## 项目创建，模板化，脚手架工具等

## 持续集成

## 项目部署


- vite和webpack 哪方面更好
  - 本地开发的构建速度快，由于Vite是基于ESM和esbuild的，所以在本地开发时整体的构建速度会比webpack更快
使用简单，Vite内置了很多loader和配置，让开发者可以零配置跑起来一个项目，而webpack则是需要写很多复杂的配置
- vite的热更新原理是什么
  - Vite本地启动时会创建一个WebSocket连接，同时去监听本地的文件变化
当用户修改了本地的文件时，WebSocket的服务端会拿到变化的文件的ID或者其他标识，并推送给客户端
客户端获取到变化的文件信息之后，便去请求最新的文件并刷新页面


为什么webpack打包慢？为什么vite会比webpack快？如果想提高webpack速度，应该怎么做？

Webpack优化——将你的构建效率提速翻倍


webpack 和 rollup 有什么不同，打包的大小体积为什么有区别
tree Shink 基于什么实现的
webpack tree Shink 和 rollup 有什么不同
Vite 和 Esbuild 的关系怎么来理解
什么是 babel，它的作用是什么，以及和 Swc 的区别是什么


## babel的转换流程是什么样的

首先读取字符串，然后通过babel-parser将字符串代码转换成抽象语法树AST，之后对该AST进行节点遍历和转换，生成新的AST，最后通过babel-generator将新的AST再转换成新的代码字符串。

## babel包含哪几个部分，核心包有哪些

包含脚手架cli、一些预设转换规则preset、语法兼容模块polyfill和插件plugin等。核心包主要有@babel/core、@babel/parser、@babel/traverse、@babel/generator等。


## 性能优化
- 首屏FCP
  - 减少白屏
  - 减小入口文件体积
  - 静态资源本地缓存和图片资源的压缩
  - 关于webpack的插件
    - 所有图片上传到oss
    - 上面的懒加载相关内容
  - 静态资源的本地缓存
  - 页面优化、长列表等 虚拟列表


## 性能监控

## 业务监控警告

## 线上白屏如何定位


如何设计一个类似于elementui这样的可以单包发布，也可以多包发布的框架