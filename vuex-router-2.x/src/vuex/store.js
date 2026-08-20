/* eslint-disable*/
import appllyMixin from "./mixin";
import ModuleCollection from "./module/module-collection";
import { forEachValue } from "./util";

let Vue;
//获取最新的状态
function getState(store,path){
  return path.reduce((newState,current)=>{
    return newState[current]
  },store.state)
}
function installModule(store, rootState, path, module) {
  //注册事件时 需要注册到对应的命名空间中 path就是所有的路径 根据path算出一个空间里
  // console.log(store._modules)
  //getNamespace 也可以写成全局方法 现在封装到类里面
  let namespace = store._modules.getNamespace(path);
  // console.log(namespace);

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
    store._mutations[namespace + type] =
      store._mutations[namespace + type] || [];
    store._mutations[namespace + type].push((payload) => {
      // mutation.call(store, module.state, payload);//内部可能会替换状态，如果一直使用module.state 可能是老的状态
      mutation.call(store, getState(store,path), payload)
      //调用订阅的事件
      store._subscribers.forEach(sub=>sub({mutation,type},store.state))
    });
  });
  module.forEachAction((action, type) => {
    store._actions[namespace + type] = store._actions[namespace + type] || [];
    store._actions[namespace + type].push((payload) => {
      action.call(store, store, payload);
    });
  });
  module.forEachGetter((getter, key) => {
    //如果getters重名会覆盖 所有的模块的getters都会定义到根模块上
    store._wrapperGetters[namespace + key] = function (params) {
      return getter(getState(store,path));
    };
  });
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}
function resetStoreVm(store, state) {
  const wrapperGetters = store._wrapperGetters;
  let oldVm = store._vm;
  const computed = {};
  store.getters = {};
  forEachValue(wrapperGetters, (fn, key) => {
    computed[key] = function () {
      return fn();
    };
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
    });
  });
  store._vm = new Vue({
    data: {
      $$state: state, //vue中定义数据，属性名是有特点的  如果属性名是$xxx命名的 他不会被代理vue的实例上 所以用了两个$$
    },
    computed,
  });
  //老的实例直接销毁
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroyed());
  }
  console.log(store._vm, "_vm");
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
    this._subscribers=[] //存放插件
    installModule(this, state, [], this._modules.root);
    //将状态放到vue的实例中去
    resetStoreVm(this, state);
  }
  subscribe(fn){
    this._subscribers.push(fn)
  }
  commit = (type, payload) => {
    //这需要考虑this问题，为了方便用箭头函数，为什么会有this问题，因为aciton参数可以解构{commit,store}
    // this._mutations[type](payload);
    this._mutations[type].forEach((fn) => fn(payload));
  };
  dispatch(type, payload) {
    // this._acitons[type](payload);
    this._actions[type].forEach((fn) => fn(payload));
  }
  replaceState(newState){
    this._vm._data.$$state=newState
  }
  // 用户怎么拿数据？ 通过类属性访问器，当用户去这个实例上取states属性时会执行此方法
  get state() {
    return this._vm._data.$$state;
  }
  registerModule(path, rawModule) {
    if (typeof path === "string") path = [path];
    console.log(rawModule,'rawModule')
    //实现模块注册
    this._modules.register(path, rawModule);

    //安装模块
    installModule(this, this.state, path, rawModule.newModule);

    //考虑getters 是用的vue计算属性 还得放在实例上去重新定义getters,但是问题 又会生成一个vue实例，上一个实例怎么销毁？
    resetStoreVm(this, this.state);
    //执行插件
    if(options.plugins){
      options.plugins.forEach((plugin=>plugin(this)))
    }
  }
}
const install = (_Vue) => {
  Vue = _Vue;
  appllyMixin(Vue);
};
export { Store, install };
