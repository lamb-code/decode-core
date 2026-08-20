/* eslint-disable*/
import appllyMixin from "./mixin";
import { forEachValue } from "./util";
let Vue;
//  最终用户拿到是这个实例
class Store {
  constructor(options) {
    console.log("install vuex", options);
    let state = options.state;
    // 如果直接将state定义在实例上 稍后这个状态发生变化 视图是不会更新的

    //getters 其实写得是方法 但是取值的时候是属性
    //defineProperty去定义这个属性
    // this.getters = options.getters
    this.getters = {};
    //通过计算属性有缓存作用
    const computed = {};
    forEachValue(options.getters, (fn, key) => {
      computed[key] = () => {
        return fn(this.state);
      };
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
      });
      // Object.defineProperty(this.getters, key, {
      //     get: () => fn(this.state)
      // })
    });
    this._vm = new Vue({
      data: {
        $$state: state, //vue中定义数据，属性名是有特点的  如果属性名是$xxx命名的 他不会被代理vue的实例上 所以用了两个$$
      },
      computed,
    });

    this._mutations = {};
    //发布订阅模式 将用户定义的action 先保存起来 稍后当调用commit时就找订阅的mutation的方法 调用dispatch就找对应的action方法
    forEachValue(options.mutations, (fn, type) => {
      this._mutations[type] = (payload) => fn.call(this, this.state, payload);
    });
    this._actions = {};
    forEachValue(options.actions, (fn, type) => {
      this._actions[type] = (payload) => fn.call(this, this, payload);
    });
  }
  commit = (type, payload) => {
    this._mutations[type](payload);
  };
  dispatch = (type, payload) => {
    this._actions[type](payload);
  };
  get state() {
    return this._vm._data.$$state;
  }
}
const install = (_Vue) => {
  Vue = _Vue;
  appllyMixin(Vue);
};
export { Store, install };
