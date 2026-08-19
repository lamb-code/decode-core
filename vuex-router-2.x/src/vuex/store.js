/* eslint-disable*/
import appllyMixin from "./mixin";
let Vue;
//  最终用户拿到是这个实例

//用户最终拿到是这个类的实例
class Store {
  constructor(options) {
    // this.state = options.state; //如果直接state定义在实例上，稍后这个状态发生变化 视图是不会更新的，vue-router 是通过defineReactive 创建响应式数据
    let state = options.state;
    //vuex则是创建个vue实例
    this._vm = new Vue({
      data: {
        $$state: state, //为什么两个$$?vue 中定义数据属性名是有特点的，如果属性名是通过 $xxx 命名的 他不会被代理到vue实例上。
      },
    });
  }
  // 用户怎么拿数据？ 通过类属性访问器，当用户去这个实例上取states属性时会执行此方法
  get state() {
    return this._vm.data.$$state;
  }

  get state() {
    return this._vm._data.$$state;
  }
}
const install = (_Vue) => {
  Vue = _Vue;
  appllyMixin(Vue);
};
export { Store, install };
