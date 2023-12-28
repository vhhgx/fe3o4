# vuex状态管理器

https://juejin.cn/post/6850037277675454478#heading-28

## 是什么

Vuex 是一个专为 Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。





怎么使用vuex
第一步安装
npm install vuex -S
复制代码
第二步创建store
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
//不是在生产环境debug为true
const debug = process.env.NODE_ENV !== 'production'
//创建Vuex实例对象
const store = new Vuex.Store({
    strict:debug,//在不是生产环境下都开启严格模式
    state:{
    },
    getters:{
    },
    mutations:{
    },
    actions:{
    }
})
export default store
复制代码
第三步注入vuex
import Vue from 'vue'
import App from './App.vue'
import store from './store'
const vm = new Vue({
    store:store,
    render: h => h(App)
}).$mount('#app')




谈一下对 vuex 的个人理解
vuex 是专门为 vue 提供的全局状态管理系统，用于多个组件中数据共享、数据缓存等。（无法持久化、内部核心原理是通过创造一个全局实例 new Vue）
主要包括以下几个模块：

State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。


mutation 是同步更新， $watch 严格模式下会报错
action 是异步操作，可以获取数据后调用 mutation 提交最终数据