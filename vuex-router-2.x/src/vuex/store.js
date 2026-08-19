/* eslint-disable*/
import appllyMixin from "./mixin";
import { forEachValue } from "./util";

let Vue;
//  最终用户拿到是这个实例

//用户最终拿到是这个类的实例
class Store {
  constructor(options) {
    // this.state = options.state; //如果直接state定义在实例上，稍后这个状态发生变化 视图是不会更新的，vue-router 是通过defineReactive 创建响应式数据
    let state = options.state;
    // this.getters = options.getters //getters 其实写的是方法，但是取值的时候是属性,所以用到defineProperty
    this.getters = {};
    const computed = {};
    /*
     每次更新都会执行,考虑到缓存效果都放在computed里
    forEachValue(options.getters,(fn,key)=>{
      Object.defineProperty(this.getters,key,{
        get:()=>fn(this.state)
      })
    })
    */
    forEachValue(options.getters, (fn, key) => {
      computed[key] = () => {
        return fn(this.state);
      };
      Object.defineProperty(this.getters, key, {
        // get: () => fn(this.state),
        get: () => this._vm[key], //也就是取的vue实例计算属性
      });
    });

    //vuex则是创建个vue实例
    this._vm = new Vue({
      data: {
        $$state: state, //为什么两个$$?vue 中定义数据属性名是有特点的，如果属性名是通过 $xxx 命名的 他不会被代理到vue实例上。
      },
      computed, //计算属性会降自己的属性放到实例上
    });

    //将用户的mutation，action 先保存起来 稍后当调用 commit时 就找订阅的mutation方法 调用dispatch 就找对应的action方法 采用的是发布订阅模式
    this._mutations = {};
    forEachValue(options.mutations, (fn, type) => {
      this._mutations[type] = (payload) => {
        fn.call(this, this.state, payload);
      };
    });

    this._acitons = {};
    forEachValue(options.actions, (fn, type) => {
      this._acitons[type] = (payload) => {
        fn.call(this, this, payload);
      };
    });
  }
  commit = (type, payload) => {
    //这需要考虑this问题，为了方便用箭头函数，为什么会有this问题，因为aciton参数可以解构{commit,store}
    this._mutations[type](payload);
  };
  dispatch(type, payload) {
    this._acitons[type](payload);
  }
  // 用户怎么拿数据？ 通过类属性访问器，当用户去这个实例上取states属性时会执行此方法
  get state() {
    return this._vm.data.$$state;
  }
}
const install = (_Vue) => {
  Vue = _Vue;
  appllyMixin(Vue);
};
export { Store, install };
