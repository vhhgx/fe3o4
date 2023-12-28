# JS面试问答 - 浏览器和网络相关


## 浏览器存储

- cookie：在http中是一个请求头，适合存储需要与服务器交互的数据，跟随请求自动发送到服务器，最多保存4k的数据，可以用document.cookie来进行操作
  - session与之有关，但储存在服务端。通常客户端只有一个session id，和sessionStorage类似，页面会话结束后自动消失
  - cookie在登陆网站后，服务器会发送一个响应头，包含设置cookie的指令，然后浏览器会根据指令将cookie存储在本地，并且跟随请求自动发送
- localStorage：长期储存，永远不会失效，除非手动清除。保存5M左右的数据。仅在客户端储存，不随http请求发送到服务器
- sessionStorage：数据在页面会话结束后自动消失，也是5M，仅客户端存储。同一个父窗口打开的新窗口会共享，但手动通过url打开不共享，刷新页面不会重置
- caches：主要用于pwa，容量由浏览器进行管理。用于存储网络资源，如api的相应，文件等内容
- indexedDB：可以存文件，没有限制。键值对存储，适合储存大量的数据

## JWT

jwt没有状态，也不需要在服务器端储存会话消息，分为header、载荷和签名

- header：包含token的类型，和所使用的签名算法。base64得到一个字符串a
- 载荷：包含一些用户数据。base64得到一个字符串b
- 然后 `a.b, 签名`进行算法签名，得到字符串c


`a.b.c`就是jwt字符串的所有内容


jwt可以存在cookie、和各类storage中，看如何考虑。存cookie可以减少请求伪造的风险，存stroage可以方便前端管理。缺点在于安全性，是明文的。性能可能会不好，失效时间也有问题


如果把jwt放在header的话，需要显式的设置`Authorization`Header


## 浏览器标签之间的通信

TODO 渡一 - 看一下渡一的视频

- localStorage
- window.postMessage


## 跨域

基于同源策略，协议、主机、端口有任一不同，就会产生跨域

NOTE 这里会出现和安全相关的问题，像表单或者xss相关，还有csrf攻击和防御手段，目前阶段不重要


### document.domain

该⽅式只能⽤于⼆级域名相同的情况下，⽐如 a.test.com 和 b.test.com 适⽤于该⽅式。只需要给⻚⾯添加 document.domain = 'test.com' 表⽰⼆级域名都相同就可以实现跨域

### cors

当使⽤GET、HEAD、POST等请求方法，以及Content-Type的值为text/plain、multipart/form-data和application/x-www-form-urlencoded时，会发起简单请求，浏览器判断是简单请求的话就会在请求头添加origin字段，值是发起请求的所在的源。服务端收到请求后会判断origin是否在⾃⼰的许可范围，如果不在就拒绝，如果在就会有以下的响应头添加：

- Access-Control-Allow-Origin（必选）：告诉客户端我接受请求，值为origin的值，若允许所有源请求就会返回 *。
- Access-Control-Allow-Credentials（可选）：告诉浏览器发送请求时携带Cookie，true表⽰允许false表⽰禁⽌。
- Access-Control-Expose-Headers（可选）：额外给客户端返回的头部字段。


复杂请求的话会先发起options请求进行预检，询问服务器是否允许我进⾏跨域请求资源。并且允许客户端⾃定义请求头的类型，询问服务器是否允许。然后服务器会进⾏验证，还会在响应头进⾏说明允许你的请求

- Access-Control-Allow-Origin：告诉客户端，允许你这个源的请求
- Access-Control-Allow-Methods：告诉客户端，服务端允许的跨域 AJAX 请求的类型，也可进⾏ GET 或者 POST 请求
- Access-Control-Allow-Headers：告诉客户端，服务端允许的发送请求时的⾃定义请求头
- Access-Control-Max-Age: 告诉客户端预检请求的有效期，省去了多次的预检请求。也就是说，1728000 秒内你可以直接发送真正的 AJAX 请求，不⽤每次询问


```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://xxx.com/',
        pathRewrite: {'^/api' : ''}, 
        changeOrigin: true, // target是域名的话，需要这个参数， 
        secure: false, // 设置支持https协议的代理 
      }
    }
  }
}
```

### nginx

```bash
# 如果监听到请求接口地址是 www.xxx.com/api/page ，nginx就向http://www.yyy.com:9
server {
  listen       80; 
  server_name  www.xxx.com;
  # 判过滤出含有api的请求 
  location /api/ { 
    proxy_pass http://www.yyy.com:9999; #真实服务器的地址 
  }
}
```

## ifrime跨域的实现方式

浏览器的多线程也是通过这种方式

主要通过window.postMessage来实现，通过postMessage方法来发送消息，接受两个参数：消息内容和接受消息窗口的源

```js
// 在父窗口中，向 iframe 发送消息
iframe.contentWindow.postMessage(message, targetOrigin);

// 在 iframe 中，向父窗口发送消息
parent.postMessage(message, targetOrigin);
```

在接受消息的窗口中，添加message事件的监听器，来处理接收到的消息

```js
window.addEventListener('message', (event) => {
  // 检查 event.origin 是否是期望的源
  if (event.origin !== 'http://expected-origin.com') {
    return;
  }

  // 处理接收到的消息
  console.log(event.data);
});
```



## 计网相关

### CDN是什么

CDN 是内容分发网络，源站提供内容，CDN 节点进行内容分发，用户可以就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。 
回源，当有用户访问某㇐个 URL 的时候，如果被解析到的那个 CDN 节点没有缓存响应的内容，或者是缓存已经到期，就会回源站去获取。如果没有人访问，
那么 CDN 节点不会主动去源站拿的。 
回源的策略间接决定了缓存的命中率，频繁回源会对源站产生较大的负担。


## 请求头和响应头

HTTP 请求头和响应头中包含了许多参数字段，用于在客户端和服务器之间传递重要的信息。以下是一些常见的字段及其用途：

### 常见的 HTTP 请求头字段

1. **Host**: 请求的目标主机和端口号。
2. **User-Agent**: 发出请求的浏览器和操作系统信息。
3. **Accept**: 客户端能接收的内容类型（如 `text/html`, `application/json`）。
4. **Accept-Language**: 客户端优先接收的语言。
5. **Accept-Encoding**: 客户端支持的内容编码（如 `gzip`, `deflate`）。
6. **Connection**: 控制不同请求/响应之间的连接管理（如 `keep-alive`）。
7. **Authorization**: 认证信息，如基本认证或 OAuth。
8. **Referer**: 包含一个 URL，用户从该 URL 代表的页面发出当前请求。
9. **Content-Type**: 请求体的 MIME 类型（仅在 POST 和 PUT 请求中使用）。
10. **Cache-Control**: 缓存控制指令。

### 常见的 HTTP 响应头字段

1. **Content-Type**: 响应体的 MIME 类型。
2. **Content-Length**: 响应体的长度（字节）。
3. **Content-Encoding**: 响应体的编码方式。
4. **Set-Cookie**: 服务器发送的 Cookie。
5. **Cache-Control**: 缓存控制指令。
6. **Expires**: 响应内容过期的日期/时间。
7. **Last-Modified**: 资源的最后修改日期和时间。
8. **ETag**: 资源的特定版本标识。
9. **Server**: 服务器软件信息。
10. **WWW-Authenticate**: 表明客户端请求应该使用的认证方法（在 401 响应中使用）。

### HTTP 缓存相关字段

- **强缓存字段**:
  - `Cache-Control`: 指定缓存行为（如 `max-age`）。
  - `Expires`: 指定资源过期的时间。

- **协商缓存字段**:
  - `Last-Modified` / `If-Modified-Since`: 资源的最后修改时间。
  - `ETag` / `If-None-Match`: 资源的特定版本标识。

### 字段属性值

- `Cache-Control`: 可以有多种指令，如 `no-cache`, `no-store`, `max-age=30`（30秒）。
- `Expires`: HTTP 日期格式，如 `Thu, 01 Dec 1994 16:00:00 GMT`。
- `ETag`: 资源的唯一标识，如 `"686897696a7c876b7e"`。

### 存放位置

- 这些字段通常存放在 HTTP 请求或响应的头部。

### 字段时间区别

- `Last-Modified`: 表示资源最后被修改的时间。
- `Expires`: 表示资源的过期时间。

### 字段共存

- `Last-Modified` 和 `Expires` 可以共存，但 `Cache-Control` 的 `max-age` 指令会覆盖 `Expires`。

### 设计无缓存的 HTTP 缓存

- 设置 `Cache-Control: no-store`，确保资源不被缓存。

### `no-cache` 与 `no-store` 的区别

- `no-cache`: 指示资源可能被缓存但在使用前必须验证其有效性。
- `no-store`: 完全禁止缓存，不存储任何部分的请求或响应。


## get和post区别

- get参数长度有限制，请求会被缓存。所以在浏览器回退不会再次请求
- post在请求体中，没有限制。请求不会缓存
- get产生一个tcp的数据包，post产生两个

## crtl+R和F5的刷新的区别，请求头有什么变化


在大多数浏览器中，使用 `Ctrl + R` 或 `F5` 键来刷新页面通常有相似的效果，即它们都会重新加载当前页面。然而，它们在处理缓存的方式上可能有细微的差异，这取决于浏览器的具体实现。

### `Ctrl + R` vs `F5`

- **普通刷新（`F5`）**:
  - 这通常触发一个标准的刷新，浏览器可能会根据已有的缓存策略（如 HTTP 头中的 `Cache-Control` 和 `Expires`）来决定是否需要从服务器获取新的数据。
  - 在普通刷新中，如果缓存是有效的（即没有过期），浏览器可能会从缓存中加载资源，而不是从服务器重新请求。

- **强制刷新（`Ctrl + R`）**:
  - 这通常被视为一种强制刷新，意图忽略本地缓存，从服务器重新请求所有资源。
  - 在强制刷新中，浏览器一般会发送 HTTP 请求，携带如 `Cache-Control: no-cache` 的头信息，告诉服务器忽略缓存，返回最新的资源。

### 请求头的变化

- 在普通刷新（`F5`）时，请求头通常不包含特殊指令来绕过缓存。
- 在强制刷新（`Ctrl + R`）时，请求头可能包含一些指示服务器忽略缓存的信息，例如：
  - `Cache-Control: no-cache`：告诉服务器忽略缓存，并返回一个新的响应。
  - `Pragma: no-cache`：这是一个较老的 HTTP/1.0 头信息，用于类似的目的。

### 总结

虽然 `Ctrl + R` 和 `F5` 在大多数情况下表现相似，但 `Ctrl + R` 倾向于强制浏览器从服务器重新加载资源，而 `F5` 可能会利用浏览器缓存。具体行为还取决于浏览器的具体实现和当前页面的缓存策略。对于开发人员来说，了解这些差异有助于更有效地管理和测试浏览器缓存行为。


## 浏览器从输入URL到渲染完毕全过程


### 简略回答

1. 浏览器单独开一个线程来处理该请求，并且对url进行分析判断是用什么协议
2. 调用浏览器内核中的对应方法
3. DNS解析IP地址，设置UA等信息发出get请求
4. 进行HTTP协议对话，客户端发送请求报头
5. 进入到web服务器上的 Web Server，如 Apache、Tomcat、Node.JS 等服务器
6. 进入部署好的后端应用，如 PHP、Java、JavaScript、Python 等，找到对应的请求处理
7. 处理结束回馈报头，此处如果浏览器访问过，缓存上有对应资源，会与服务器最后修改时间对比，一致则返回304
8. 浏览器开始下载html文档(响应报头，状态码200)，同时使用缓存
9. 文档树建立，根据标记请求所需指定MIME类型的文件（比如css、js）,同时设置了cookie
10. 页面开始渲染DOM，JS根据DOM API操作DOM,执行事件绑定等，页面显示完成。


- DNS 解析
- TCP 三次握手
- 发送请求，分析 url，设置请求报文(头，主体)
- 服务器返回请求的文件 (html)
- 浏览器渲染
  - HTML parser -- DOM Tree
    - 标记化算法，进行元素状态的标记
    - dom 树构建
  - CSS parser -- Style Tree
    - 解析 css 代码，生成样式树
  - attachment -- Render Tree
    - 结合 dom树 与 style树，生成渲染树
  - layout: 布局
  - GPU painting: 像素绘制页面

- 浏览器根据地址去本身缓存中查找dns解析记录，如果有，则直接返回IP地址，否则浏览器会查找操作系统中（hosts文件）是否有该域名的dns解析记录，如果有则返回。
- 如果浏览器缓存和操作系统hosts中均无该域名的dns解析记录，或者已经过期，此时就会向域名服务器发起请求来解析这个域名。
- 请求会先到LDNS（本地域名服务器），让它来尝试解析这个域名，如果LDNS也解析不了，则直接到根域名解析器请求解析
- 根域名服务器给LDNS返回一个所查询余的主域名服务器（gTLDServer）地址。
- 此时LDNS再向上一步返回的gTLD服务器发起解析请求。
- gTLD服务器接收到解析请求后查找并返回此域名对应的Name Server域名服务器的地址，这个Name Server通常就是你注册的域名服务器（比如阿里dns、腾讯dns等）
- Name Server域名服务器会查询存储的域名和IP的映射关系表，正常情况下都根据域名得到目标IP记录，连同一个TTL值返回给DNS Server域名服务器
- 返回该域名对应的IP和TTL值，Local DNS Server会缓存这个域名和IP的对应关系，缓存的时间有TTL值控制。
- 把解析的结果返回给用户，用户根据TTL值缓存在本地系统缓存中，域名解析过程结束。

### 完整回答

这个问题很经典，也是很多⾯试⾼级前端时必问的问题。我也在⾯试时遇到过，只不过不同的是，⾯试官在这之前还问了⼀个问题，那就是从打开⼀个浏览器标签⻚开始，发⽣了什么。

也就是说，考察的是⾯试者对浏览器进程与线程的认知程度。下⾯是浏览器中进程的相关概念：

- 浏览器是多进程的
- 浏览器之所以能够运⾏，是因为系统给它的进程分配了资源（cpu、内存）
- 简单点理解，每打开⼀个 Tab ⻚，就相当于创建了⼀个独⽴的浏览器进程。


也就是说，新打开⼀个 TAB ⻚，实际上就创建了⼀个浏览器进程，但是有时候会有不同，为了性能考虑，浏览器的优化策略会将多个空的 TAB ⻚进程合并成⼀个，在有输⼊内容之后才分离出来创建另⼀个新的浏览器进程。

下⾯来说说当输⼊ url 之后，到底发⽣了什么。总体来说分为以下⼏个过程:

- DNS 解析
- TCP 连接
- 发送 HTTP 请求
- 服务器处理请求并返回 HTTP 报⽂
- 浏览器解析渲染⻚⾯
- 连接结束

### DNS 解析
这个过程实际上是浏览器将输⼊的 url 发送到 DNS 服务器进⾏查询，DNS 服务器会返回当前查询 url 的 IP 地址。它实际上充当了⼀个翻译的⾓⾊，实现了⽹址到 IP 地址的转换DNS 解析是⼀个递归查询的过程。

上图中演⽰的过程经历了 8 个步骤，如果每次都是这样，必然会损耗⼤量的资源，所以我们必须对 DNS 解析进⾏优化。
- DNS 缓存：DNS 存在着多级缓存，从离浏览器的距离排序的话，有以下⼏种: 浏览器缓存，系统缓存，路由器缓存，IPS 服务器缓存，根域名服务器缓存，顶级域名服务器缓存，主域名服务器缓存
- DNS 负载均衡：DNS 可以返回⼀个合适的机器的 IP 给⽤户，例如可以根据每台机器的负载量，该机器离⽤户地理位置的距离等等，这种过程就是 DNS 负载均衡，⼜叫做 DNS 重定向。⼤家⽿熟能详的 CDN(Content Delivery Network) 就是利⽤ DNS的重定向技术，DNS 服务器会返回⼀个跟⽤户最接近的点的 IP 地址给⽤户，CDN节点的服务器负责响应⽤户的请求，提供所需的内容


### TCP 连接

HTTP 协议是使⽤ TCP 作为其传输层协议的，当 TCP 出现瓶颈时，HTTP 也会受到影响。HTTP 报⽂是包裹在 TCP 报⽂中发送的，服务器端收到 TCP 报⽂时会解包提取出HTTP 报⽂。但是这个过程中存在⼀定的⻛险，HTTP 报⽂是明⽂，如果中间被截取的话会存在⼀些信息泄露的⻛险。那么在进⼊ TCP 报⽂之前对 HTTP 做⼀次加密就可以解决这个问题了。HTTPS 协议的本质就是 HTTP + SSL(or TLS)。在 HTTP 报⽂进⼊ TCP 报⽂之前，先使⽤ SSL 对 HTTP 报⽂进⾏加密。从⽹络的层级结构看它位于 HTTP 协议与TCP 协议之间。

HTTPS 在传输数据之前需要客户端与服务器进⾏⼀个握⼿ (TLS/SSL 握⼿)，在握⼿过程中将确⽴双⽅加密传输数据的密码信息。TLS/SSL 使⽤了⾮对称加密，对称加密以及hash 等

### HTTP 请求

发送 HTTP 请求的过程就是构建 HTTP 请求报⽂并通过 TCP 协议中发送到服务器指定端⼝ (HTTP 协议 80/8080, HTTPS 协议 443)。HTTP 请求报⽂是由三部分组成: 请求⾏, 请求报头和请求正⽂。

请求⾏的格式如下：

```
Method Request-URL HTTP-Version CRLF
```
例如：
```
eg: GET index.html HTTP/1.1
```

常⽤的⽅法有: GET, POST, PUT, DELETE, OPTIONS, HEAD

请求报头：请求报头允许客户端向服务器传递请求的附加信息和客户端⾃⾝的信息。常⻅的请求报头有: Accept , Accept-Charset , ccept-Encoding , Accept-Language , Content-Type ,Authorization , Cookie , User-Agent 等。

Accept ⽤于指定客户端⽤于接受哪些类型的信息， Accept-Encoding 与 Accept 类似，它⽤于指定接受的编码⽅式。 Connection 设置为 Keep-alive ⽤于告诉客户端本次 HTTP 请求结束之后并不需要关闭 TCP 连接，这样可以使下次 HTTP 请求使⽤相同的 TCP 通道，节省TCP 连接建⽴的时间。

请求正⽂： 当使⽤ POST, PUT 等⽅法时，通常需要客户端向服务器传递数据。这些数据就储存在请求正⽂中。在请求包头中有⼀些与请求正⽂相关的信息，例如: 现在的 Web应⽤通常采⽤ Rest 架构，请求的数据格式⼀般为 json。这时就需要设置 Content-Type: application/json 。



### 服务器处理请求并返回 HTTP 报⽂

后端从在固定的端⼝接收到 TCP 报⽂开始，这⼀部分对应于编程语⾔中的 socket。它会对 TCP 连接进⾏处理，对 HTTP 协议进⾏解析，并按照报⽂格式进⼀步封装成 HTTP Request 对象，供上层使⽤。这⼀部分⼯作⼀般是由 Web 服务器去进⾏

HTTP 响应报⽂也是由三部分组成: 状态码, 响应报头和响应报⽂。

状态码是由 3 位数组成，第⼀个数字定义了响应的类别，且有五种可能取值:

- 1xx：指⽰信息–表⽰请求已接收，继续处理。
- 2xx：成功–表⽰请求已被成功接收、理解、接受。
- 3xx：重定向–要完成请求必须进⾏更进⼀步的操作。
- 4xx：客户端错误–请求有语法错误或请求⽆法实现。
- 5xx：服务器端错误–服务器未能实现合法的请求。

平时遇到⽐较常⻅的状态码有: 200, 204, 301, 302, 304, 400, 401, 403, 404, 422, 500

响应报头: 常⻅的响应报头字段有: Server, Connection…。
响应报⽂: 服务器返回给浏览器的⽂本信息，通常 HTML, CSS, JS, 图⽚等⽂件就放在这⼀部分


### 浏览器解析渲染⻚⾯
浏览器在收到 HTML,CSS,JS ⽂件后，它是如何把⻚⾯呈现到屏幕上的

浏览器是⼀个边解析边渲染的过程。⾸先浏览器解析 HTML ⽂件构建 DOM 树，然后解
析 CSS ⽂件构建渲染树，等到渲染树构建完成后，浏览器开始布局渲染树并将其绘制到
屏幕上, 这个过程⽐较复杂，涉及到两个概念: reflow (回流) 和 repain (重绘)。


- reflow ： DOM 节点中的各个元素都是以盒模型的形式存在，这些都需要浏览器去计算其位置和⼤⼩等，这个过程称为 reflow
- repain 当盒模型的位置, ⼤⼩以及其他属性，如颜⾊, 字体, 等确定下来之后，浏览器便开始绘制内容，这个过程称为 repain

⻚⾯在⾸次加载时必然会经历 reflow 和 repain 。 reflow 和 repain 过程是⾮常消耗性能的，尤其是在移动设备上，它会破坏⽤户体验，有时会造成⻚⾯卡顿。所以我们应该尽可能少的减少 reflow 和 repain


JS 的解析是由浏览器中的 JS 解析引擎完成的。JS 是单线程运⾏，也就是说，在同⼀个时间内只能做⼀件事，所有的任务都需要排队，前⼀个任务结束，后⼀个任务才能开始。但是⼜存在某些任务⽐较耗时，如 IO 读写等，所以需要⼀种机制可以先执⾏排在后⾯的任务，这就是：同步任务 (synchronous) 和异步任务(asynchronous)。

JS 的执⾏机制就可以看做是⼀个主线程加上⼀个任务队列 (task queue)。同步任务就是放在主线程上执⾏的任务，异步任务是放在任务队列中的任务。所有的同步任务在主线程上执⾏，形成⼀个执⾏栈; 异步任务有了运⾏结果就会在任务队列中放置⼀个事件；脚本运⾏时先依次运⾏执⾏栈，然后会从任务队列⾥提取事件，运⾏任务队列中的任务，这个过程是不断重复的，所以⼜叫做事件循环 (Event loop)。

浏览器在解析过程中，如果遇到请求外部资源时，如图像, iconfont,JS 等。浏览器将重复上⾯的过程下载该资源。请求过程是异步的，并不会影响 HTML ⽂档进⾏加载，但是当⽂档加载过程中遇到 JS ⽂件，HTML ⽂档会挂起渲染过程，不仅要等到⽂档中 JS ⽂件加载完毕还要等待解析执⾏完毕，才会继续 HTML 的渲染过程。原因是因为 JS 有可能修改 DOM 结构，这就意味着 JS 执⾏完成前，后续所有资源的下载是没有必要的，这就是JS 阻塞后续资源下载的根本原因。CSS ⽂件的加载不影响 JS ⽂件的加载，但是却影响JS ⽂件的执⾏。JS 代码执⾏前浏览器必须保证 CSS ⽂件已经下载并加载完毕



**扩展：** 从打开一个浏览器标签页开始，发生了什么

## TCP、UDP、HTTP之间的区别

TCP/IP 协议栈主要分为四层: 应⽤层、传输层、⽹络层、数据链路层, 每层都有相应的协议

- IP：⽹络层协议；（类似于⾼速公路）
- TCP 和 UDP：传输层协议；（类似于卡⻋）
- HTTP：应⽤层协议；（类似于货物）。HTTP(超⽂本传输协议)是利⽤ TCP 在两台电脑 (通常是 Web 服务器和客户端) 之间传输信息的协议。客户端使⽤ Web 浏览器发起 HTTP 请求给 Web 服务器，Web 服务器发送被请求的信息给客户端。

其实重要的在 TCP 和 UDP，那它们有什么区别呢？
TCP（传输控制协议，Transmission Control Protocol）：(类似打电话)

⾯向连接、传输可靠（保证数据正确性）、有序（保证数据顺序）、传输⼤量数据（流模式）、速度慢、对系统资源的要求多，程序结构较复杂，每⼀条 TCP 连接只能是点到点的，TCP ⾸部开销 20 字节。

UDP(⽤户数据报协议，User Data Protocol)：（类似发短信）
⾯向⾮连接 、传输不可靠（可能丢包）、⽆序、传输少量数据（数据报模式）、速度快，对系统资源的要求少，程序结构较简单 ， UDP ⽀持⼀对⼀，⼀对多，多对⼀和多对多的交互通信，UDP 的⾸部开销⼩，只有 8 个字节。

TCP 建⽴连接需要三次握⼿：
- 第⼀次握⼿：客户端发送 syn 包 (seq=x) 到服务器，并进⼊ SYN_SEND 状态，等待服务器确认；
- 第⼆次握⼿：服务器收到 syn 包，必须确认客户的 SYN（ack=x+1），同时⾃⼰也发送⼀个 SYN 包（seq=y），即 SYN+ACK 包，此时服务器进⼊ SYN_RECV 状态；
- 第三次握⼿：客户端收到服务器的 SYN＋ACK 包，向服务器发送确认包ACK(ack=y+1)，此包发送完毕，客户端和服务器进⼊ ESTABLISHED 状态，完成三次握⼿。

握⼿过程中传送的包⾥不包含数据，三次握⼿完毕后，客户端与服务器才正式开始传送数据。理想状态下，TCP 连接⼀旦建⽴，在通信双⽅中的任何⼀⽅主动关闭连接之前，TCP 连接都将被⼀直保持下去

结论：

HTTP 协议是建⽴在请求 / 响应模型上的。⾸先由客户建⽴⼀条与服务器的 TCP 链接，并发送⼀个请求到服务器，请求中包含请求⽅法、URI、协议版本以及相关的 MIME 样式的消息。服务器响应⼀个状态⾏，包含消息的协议版本、⼀个成功和失败码以及相关的MIME 式样的消息

虽然 HTTP 本⾝是⼀个协议，但其最终还是基于 TCP


## 回流

回流（reflow）指的是当 DOM 的变化影响了元素的布局，浏览器需要重新计算元素的位置和大小，重新绘制元素的过程。回流是一种非常耗费性能的操作，因为它会涉及到整个页面的重新渲染。

以下情况会触发回流：

1. 修改了 DOM 元素的几何属性，如 `width`、`height`、`padding`、`margin`、`border`、`display` 等。
2. 修改了 DOM 元素的文本内容或者字体样式。
3. 修改了 DOM 元素的位置属性，如 `top`、`left`、`right`、`bottom`。
4. 获取某些属性值时，如 `offsetWidth`、`offsetHeight`、`clientWidth`、`clientHeight`、`scrollTop`、`scrollLeft` 等。
5. 修改了页面的默认样式表，如通过添加、删除、修改样式表或者改变 `link` 标签等方式。

需要注意的是，回流操作会对页面性能产生很大的影响，因此应该尽量避免触发回流操作。可以通过以下几种方式来减少回流的发生：

1. 使用 CSS3 的 `transform` 和 `opacity` 属性代替传统的布局属性。
2. 尽量避免频繁修改 DOM 元素的属性，可以将多个修改操作合并为一次操作。
3. 在修改 DOM 元素之前，将其从文档流中移除，修改完成后再添加回去，避免在修改过程中触发回流。
4. 对于需要频繁获取的属性，可以进行缓存，避免每次获取时触发回流。
5. 避免使用 table 布局，因为 table 布局会强制触发回流。
6. 避免使用多层嵌套的 DOM 结构，因为多层嵌套的 DOM 结构也会增加页面回流的次数。

总的来说，需要尽可能减少页面回流的次数和影响范围，以提高页面性能和用户体验。

## 重绘
assistant: 重绘（Repaint）指的是当 DOM 的变化只影响了元素的样式而不影响其布局，浏览器只需要重新绘制元素的样式而无需重新计算元素的位置和大小的过程。重绘是相对于回流而言的，比回流的成本低得多，但仍然会消耗一定的性能。

以下情况会触发重绘：

1. 修改了 DOM 元素的样式属性，如 `color`、`background`、`visibility`、`opacity` 等。
2. 通过 JavaScript 动态修改了样式属性。

需要注意的是，虽然重绘的成本比回流低，但在某些情况下，过度的重绘也会影响页面性能。因此，我们应该尽量避免不必要的重绘操作，例如：

1. 避免使用复杂的 CSS 选择器，因为复杂的选择器会增加重绘的次数。
2. 避免使用 `style` 属性频繁修改元素样式，尽量使用 CSS 样式表来定义样式。
3. 对于需要频繁修改的样式属性，可以使用 CSS 动画或者 transition 来实现，避免频繁的 JS 修改。
4. 将需要修改的元素缓存起来，尽量减少访问 DOM 的次数，避免不必要的重绘操作。
5. 将多次修改操作合并为一次操作，避免频繁的重绘操作。

总的来说，需要尽可能减少页面重绘的次数和影响范围，以提高页面性能和用户体验。



## 浏览器兼容性



