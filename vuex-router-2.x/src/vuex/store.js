/* eslint-disable*/
import appllyMixin from "./mixin";
import ModuleCollection from "./module/module-collection";
import { forEachValue } from "./util";

let Vue;

function installModule(store, rootState, path, module) {
  //如果是子模块 我就需要将子模块的状态定义到根模块上
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, rootState);
    //这个Vue.set api 可以新增属性 如果本身对象不丝滑响应式会直接复制，他会区分是否是响应式数据
    // Vue.set(rootState,path[path.length - 1],module.state)// 这样会把所有模块状态定义到根模块
    Vue.set(parent, path[path.length - 1], module.state);
  }
  module.forEachMutation((mutation, type) => {
    store._mutations[type] = store._mutations[type] || [];
    store._mutations[type].push((payload) => {
      mutation.call(store, module.state, payload);
    });
  });
  module.forEachAction((action, type) => {
    store._actions[type] = store._actions[type] || [];
    store._actions[type].push((payload) => {
      action.call(store, store, payload);
    });
  });
  module.forEachGetter((getter, key) => {
    //如果getters重名会覆盖 所有的模块的getters都会定义到根模块上
    store._wrapperGetters[key] = function (params) {
      return getter(module.state);
    };
  });
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}

//用户最终拿到是这个类的实例
class Store {
  constructor(options) {
    // // this.state = options.state; //如果直接state定义在实例上，稍后这个状态发生变化 视图是不会更新的，vue-router 是通过defineReactive 创建响应式数据
    // let state = options.state;
    // // this.getters = options.getters //getters 其实写的是方法，但是取值的时候是属性,所以用到defineProperty
    // this.getters = {};
    // const computed = {};
    // /*
    //  每次更新都会执行,考虑到缓存效果都放在computed里
    // forEachValue(options.getters,(fn,key)=>{
    //   Object.defineProperty(this.getters,key,{
    //     get:()=>fn(this.state)
    //   })
    // })
    // */
    // forEachValue(options.getters, (fn, key) => {
    //   computed[key] = () => {
    //     return fn(this.state);
    //   };
    //   Object.defineProperty(this.getters, key, {
    //     // get: () => fn(this.state),
    //     get: () => this._vm[key], //也就是取的vue实例计算属性
    //   });
    // });

    // //vuex则是创建个vue实例
    // this._vm = new Vue({
    //   data: {
    //     $$state: state, //为什么两个$$?vue 中定义数据属性名是有特点的，如果属性名是通过 $xxx 命名的 他不会被代理到vue实例上。
    //   },
    //   computed, //计算属性会降自己的属性放到实例上
    // });

    // //将用户的mutation，action 先保存起来 稍后当调用 commit时 就找订阅的mutation方法 调用dispatch 就找对应的action方法 采用的是发布订阅模式
    // this._mutations = {};
    // forEachValue(options.mutations, (fn, type) => {
    //   this._mutations[type] = (payload) => {
    //     fn.call(this, this.state, payload);
    //   };
    // });

    // this._acitons = {};
    // forEachValue(options.actions, (fn, type) => {
    //   this._acitons[type] = (payload) => {
    //     fn.call(this, this, payload);
    //   };
    // });
    //最终模块实现----------------------------------------------------------------
    //格式化用户传入的参数，格式化成树形结构
    this._modules = new ModuleCollection(options);
    let state = this._modules.root.state;
    this._mutations = {}; //存放所有模块的mutation
    this._actions = {}; //存放所有模块的action
    this._wrapperGetters = {}; //存放所有模块的getters

    installModule(this, state, [], this._modules.root);
    console.log(this._modules);
    console.log(this._mutations);
    console.log(this._actions);
    console.log(this._wrapperGetters);
    console.log(state);
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
    return this._vm._data.$$state;
  }
}
const install = (_Vue) => {
  Vue = _Vue;
  appllyMixin(Vue);
};
export { Store, install };
