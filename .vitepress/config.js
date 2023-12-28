import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Fe3O4',
  description: '一个前端面试题题库',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '深入JS', link: '/core/' },
      { text: '面试八股文', link: '/interview/' },
      { text: '手写代码', link: '/handwritten/' },
    ],

    sidebar: {
      '/core': [
        {
          text: '基础篇',
          items: [
            { text: '语法基础', link: '/core/base/grammar' },
            { text: '函数与作用域', link: '/core/base/scope' },
            { text: '对象、原型与继承', link: '/core/base/object' },
            { text: '高级对象特性', link: '/core/base/advanced-object' },
            { text: '深入异步编程', link: '/core/base/asynchronous' },
            { text: '模块系统', link: '/core/base/modules' },
            { text: '错误与异常处理', link: '/core/base/errors' },
            { text: '浏览器环境', link: '/core/base/browsers' },
            { text: 'as-事件循环', link: '/core/base/event-loop' },
            { text: 'as-Promise', link: '/core/base/promise' },
            { text: 'as-生成器', link: '/core/base/generator' },
            { text: 'as-Async', link: '/core/base/async' },
          ],
        },
        // {
        //   text: '进阶篇',
        //   items: [],
        // },
      ],
      /** 面试八股文 */
      '/interview': [
        {
          text: 'JavaScript',
          items: [
            { text: '基础内容', link: '/interview/core-base' },
            { text: '中级内容', link: '/interview/core-middle' },
            { text: '计算机网络', link: '/interview/core-network' },
            { text: '前端工程化', link: '/interview/core-engineering' },
            { text: '高阶内容', link: '/interview/core-end' },
            { text: '面试技巧', link: '/interview/skills' },
          ],
        },
        {
          text: 'HTML & CSS',
          items: [
            { text: '基础内容', link: '/interview/pages-1' },
            { text: '基础内容2', link: '/interview/pages-base' },
            { text: '中级内容', link: '/interview/pages-middle' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
          ],
        },
        {
          text: 'Vue框架',
          items: [
            { text: 'vue-1', link: '/interview/vue-1' },
            { text: '基础内容', link: '/interview/vue-base' },
            { text: '中级内容', link: '/interview/vue-middle' },
            { text: 'vue原理', link: '/interview/vue-underlying' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
            // { text: '', link: '/interview/core-' },
          ],
        },
      ],
      /** 手写代码 */
      '/handwritten': [
        {
          text: 'JavaScript',
          items: [
            { text: '原生api', link: '/handwritten/core-native' },
            { text: '常见手写', link: '/handwritten/core-common' },
            { text: '业务逻辑', link: '/handwritten/core-logic' },
            { text: '一些算法', link: '/handwritten/core-algorithm' },
            // { text: '', link: '/handwritten/core-' },
            // { text: '', link: '/handwritten/core-' },
            // { text: '', link: '/handwritten/core-' },
            // { text: '', link: '/handwritten/core-' },
            // { text: '', link: '/handwritten/core-' },
          ],
        },
        {
          text: 'HTML & CSS',
          items: [
            { text: '页面相关', link: '/handwritten/pages' },
            // { text: '', link: '/handwritten/pages-' },
            // { text: '', link: '/handwritten/pages-' },
            // { text: '', link: '/handwritten/pages-' },
            // { text: '', link: '/handwritten/pages-' },
            // { text: '', link: '/handwritten/pages-' },
          ],
        },
      ],
    },

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    // ],

    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2022-present Vhhgx',
    // },
  },
})
