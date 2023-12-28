# Async & Await



ES8引入了async/await，这是一种简化异步编程的方法，本质上是generator生成器的改进版。通过将*替换为async，并将yield替换为await，使语法更直观。使用async声明的函数自动返回一个Promise对象。await关键字用于暂停执行，直到等待的Promise解决或返回一个值，从而简化异步逻辑的处理。

有这么一个例子

```js
async function test(){
  console.log(3)
  var a = await 4
  console.log(a)
  return 1
}
```

由于async修饰的函数会被解释成Promise对象，便可以将上面的test函数翻译为下面的代码


```js
new Promise((resolve, reject) => {
  console.log(3)
  resovle(4)
}).then(res => {
  console.log(res)
})
```

在async函数中，函数执行逻辑会被第一个await所阻隔，await行右边的代码和await行上面的代码全部为同步代码，相当于promise的回调，而其他部分，则变成了异步代码，即then的回调


