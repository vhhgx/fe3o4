# HTML & CSS 相关手写题

## 实现全局的 Toast 组件

Toast 支持 string/object 两种类型的调用，其基本的样式为垂直/水平居中于屏幕中央，图片文字上下混排。

```html
import Toast from './xx/toast' export default () => { const showToast = () => {
Toast('弹出') Toast({ img: "https://p9-dy-ipv6.byteimg.com/avatar3.jpeg", text:
'弹出', }) } return (
<div class>
  <div class="test" onClick="{showToast}" />
</div>
) }
```

1. 实现一个圣杯布局

```html
<div class="bottom">header</div>
<div class="main">
  <div class="left">left</div>
  <div class="center">center</div>
  <div class="right">right</div>
</div>
<div class="bottom">bottom</div>
```

下面写 css

1. 实现一个页面头部固定，但是左侧菜单和内容是可以滚动的布局
   左侧菜单固定宽度 200px 右侧自适应，整体宽度最小 1080px

请用多种方式实现垂直居中，实现的方式越多越好

```js
<div class="wrapper">
    <div class="center-box" title="我要被垂直居中"></div>
</div>
<style>
.wrapper {
    /*父元素的宽度与高度均不固定*/
}
.center-box {
    /*TODO: */
}
</style>


```

1. 在头部区域右侧是当前用户的头像区域，头像在鼠标 hover 上去之后 可以旋转，旋转速率 是 3 秒钟旋转 360 度

【代码题】实现一个实时搜索框组件

这道题每次都是我面外包的时候让写的，没想到有一天我也会自己做这个 😂
这道题没有什么特殊的要求，就如题目所示，通过 React 实现一个实时搜索框组件即可，剩下的就是自由发挥了。

jsx 复制代码 const SearchBox = ({ onChange }) => {
const lockRef = useRef(0)
const [searchList, setSearchList] = useState([])

    const onInput = async e => {
        lockRef.current += 1
        const temp = lockRef.current
        try {
            const res = await fetch("/api/search", e.target.value)
            //  处理竞态条件
            if (lockRef.current !== temp) return
            setSearchList(res.json())
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="search-wrapper">
            <input type="text" onInput={onInput} />
            <ul className="complete-list">
                {searchList.map(item => (
                    <li key={item.value} onClick={onChange(item)}>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    )

}
