## react学习笔记
> 最近在使用react+antDesign+ES6开发，开发过程中遇到很多问题，之前总是忙着开发，问题只是简单的记录在小本本上，实在惭愧，作为前端小白要学会并习惯使用前端手段来记录和解决问题，同时也希望可以帮助初学者的你，少踩坑。废话有点多，下面进入正题！

## React
[英文文档](https://facebook.github.io/react/docs/installation.html)

[中文文档](http://www.css88.com/react/tips/communicate-between-components.html)

[React-China](http://react-china.org/)

随着ES6的爆发，React ES5和ES6的写法也出现了很大的区别，去查阅资料的时候很可能被弄蒙了，这里[使用ES5和ES6写React的不同](http://www.peachis.me/react-createclass-versus-extends-react-component/)、[注意点](http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8/3)写的还算详细，关键的地方都写出来了

### setState()
 react 利用状态state的更新qu'd驱动UI的变化，但是在实际开发过程中会发现setState()是有延迟的

 问题描述

 ```
 //翻页后刷新页面

    pageChange = (next)=>{
        this.setState({firstRow:(next-1)*Pagination.pageSize,current:next})
        this.initData()
    }

 ```
点击翻页时，会发现firstRow 第一次点击没有变，第二次才开始改变，说明setState()是有延迟的
看一下setState()到底做了什么(API中也有说明)

![setState过程](https://pic1.zhimg.com/4fd1a155faedff00910dfabe5de143fc_r.png)

 解决方案

 官方文档：http://reactjs.cn/react/docs/component-api.html

 this.setState 是在 render 时, state 才会改变调用的, 也就是说, setState 是异步的. 组件在还没有渲染之前, this.setState 还没有被调用.这么做的目的是为了提升性能, 在批量执行 State 转变时让 DOM 渲染更快.

另外, setState 函数还可以将一个回调函数作为参数, 当 setState 执行完并且组件重新渲染之后. 这个回调函数会执行, 因此如果你想查看通过 setState 改变后的 state, 可以这样写:


 ```
this.setState({myState: nextState}, ()=>{console.log(this.state.myState)})
 ```
 ### React.Component之constructor

 第一次翻译一篇外文，按照自己的一些理解，可读性比较差，大神请绕过。。。

 [原文链接](https://facebook.github.io/react/docs/react-component.html)

 用ES6写React的语法

     class Demo extends React.Component{
       constructor(props){
         super(props)
       }
     }

 构造函数是在react组件挂载(组件的生命周期：挂载、更新、移除)完成之前被调用的，当子类实现了React.Component 的constructor时，必须在状态声明之前来调用super(props)，否则在这个构造函数中this.props是undefined，从而产生Bug

 构造函数constructor是初始化state的地方，如果你不需要初始化state并且不需要bind方法，那你就不需要在你的组件中国实现constructor

 如果你不知道你需要做什么，你可以基于props初始化状态，例如

     constructor(props){
       super(props);
       this.state={
         color:props.initialColor
       }
     }

 但是要小心这种模式，因为它粗暴的forks(copy)了props并且可能会导致bugs,你通常想单独声明state，并不是同步props给state

 如果你是 'fork' props来初始化state，你应该实componentWillReceiveProps(nextProps) 这个方法以保持状态的更新，但是单独声明状态会更容易而且很少出错。
