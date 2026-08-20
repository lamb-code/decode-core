/* eslint-disable */
import install from "./install";
import createMatcher from "./create-matcher";
import HashHistory from "./history/hash";
export default class VueRouter {
  constructor(options) {
    // 什么叫路由 核心根据不同的路径跳转不同组件
    //  创建匹配器，将用户传递routes 转换扁平结构 好维护，作用1 匹配功能 2.可以添加匹配(动态路由添加 addRoutes)
    this.matcher = createMatcher(options.routes || []);
    // console.log(this.matcher, "matcher");
    //创建历史管理，路由有两种模式 (hash 浏览器api)
    this.mode = options.mode || "hash"; //区分是hash还是浏览器api 默认hash
    switch (this.mode) {
      case "hash":
        this.history=new HashHistory(this)
        break; //注意switch语法 如果不加break 后面的都会执行
      case "history":
        break;
    }
    // this.history = new HashHistory(this);
  }
  init(app) {
    //newVue app指代的是根实例
    //需要根据用户的配置(routes)做出一个映射表
    const history = this.history;
    //设置hash的监听
    const setupHashLister = () => {
      history.setupListener(); //实质就是hashChange
    };
    //跳转路径 会进行匹配操作 根据路径获取对应的记录
    history.transitionTo(history.getCurrentLocation(), setupHashLister);
    history.listen((route) => {
      app._route = route;
    });
    //需要根据当前路径 实现页面跳转的逻辑
  }
  match(location) {
    return this.matcher.match(location);
  }
  push(location) {
    const history = this.history
    window.location.hash=location
  }
}
VueRouter.install = install;
