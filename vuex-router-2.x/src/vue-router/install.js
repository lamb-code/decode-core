/* eslint-disable */
import RouterView from "./components/view";
export default function install(Vue) {
  // Vue就是Vue的构造函数
  Vue.mixin({
    beforeCreate() {
      //如果有router属性说明根实例增加了router 当前这个实例是根实例
      //页面渲染流程是先父后子 渲染完毕是先子后父
      if (this.$options.router) {
        this._routerRoot = this; //这是将当前根实例放到了_routerRoot属性上，为的是让子也拿到这个根实例
        this._router = this.$options.router; //把VueRouter实例定义到vue根实例_router 为的是让子组件通过this._routerRoot._router 可以拿到VueRouter实例
        this._router.init(this); //初始化路由表
        //如果用户更改current 是没有效果的 需要把_route进行更新，怎么处理? 在base.js 增加listen 方法接收个回调
        Vue.util.defineReactive(this, "_route", this._router.history.current); //把current 设置到当前根实例_route属性上 具有响应式
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot; //一直往上找 获取到根实例
      }
    },
  });
  //代理$route $router属性 让每个组件都有这两个属性
  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot&&this._routerRoot._route;
    },
  });
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot&&this._routerRoot._router;
    },
  });
  //注册全局属性 $route $router
  //注册全局指令 v-scroll
  //注册全局组件 router-view router-link
  Vue.component("RouterView", RouterView);
}
