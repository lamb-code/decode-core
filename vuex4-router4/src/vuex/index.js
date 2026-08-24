import { inject, reactive } from "vue";
export function forEachValue(obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key));
}

const storeKey = "store";

class Store {
  constructor(options) {
    //vuex3 内部会创建一个vue实例 但是vuex4直接采用vue3提供的响应式方法
    const store = this;
    store._state = reactive({ data: options.state }); //为什么包一层？ vuex 里面有一个比较的api replaceState
    // this.state = options.state;
    const _getters = options.getters;
    store.getters = {};
    forEachValue(_getters, function (fn, key) {
      Object.defineProperty(store.getters, key, {
        get: () => fn(store.state), //vuex中不能用computed实现，如果组件销毁了会移除计算属性
      });
    });
    store._mutations = Object.create(null);
    store._actions = Object.create(null);
    const _mutations = options.mutations;
    const _actions = options.actions;
    forEachValue(_mutations, (mutation, key) => {
      store._mutations[key] = (payload) => {
        mutation.call(store,store.state,payload)
      };
    });
    forEachValue(_actions, (mutation, key) => {
      store._actions[key] = (payload) => {
        mutation.call(store,store,payload)
      };
    });
  }
  //为什么必须箭头函数写法？
  commit=(type,payload)=>{
    this._mutations[type](payload)
  }
  dispatch=(type,payload)=>{
    this._actions[type](payload)
  }
  get state() {
    return this._state.data;
  }
  install(app, injectKey) {
    app.provide(injectKey || storeKey, this); //给根组件app 增加一个_provides，子组件会去向上查找
    app.config.globalProperties.$store = this; //增加$store属性
  }
}

export function createStore(options) {
  return new Store(options);
}

export function useStore(injectKey = storeKey) {
  return inject(injectKey);
}
