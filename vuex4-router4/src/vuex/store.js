import { reactive } from "vue";
import { forEachValue, isPromise } from "./utils";
import { storeKey } from "./injectKey";
import ModuleCollection from "./module/module-collection";
function getNestedState(state, path) {
  //根据路径获取store.上面最新的状态
  return path.reduce((moduleState, key) => moduleState[key], state);
}
function installModule(store, rootState, path, module) {
  let isRoot = !path.length; // 如果数组是空说明是根否则不是
  if (!isRoot) {
    let parentState = path
      .slice(0, -1)
      .reduce((state, key) => state[key], rootState);
    parentState[path[path.length - 1]] = module.state;
  }

  //getters
  module.forEachGetter((getter, key) => {
    store._wrappedGetters[key] = () => {
      // return getter(module.state) //如果直接使用模块上的状态，此状态不是响应式的
      return getter(getNestedState(store.state, path));
    };
  });
  module.forEachMutation((mutation, key) => {
    const entry = store._mutations[key] || (store._mutations[key] = []);
    entry.push((payload) => {
      mutation.call(store, getNestedState(store.state, path), payload);
    });
  });
  // mutation和action区别，action执行后返回一个promise
  module.forEachAction((action, key) => {
    const entry = store._actions[key] || (store._actions[key] = []);
    entry.push((payload) => {
      let res = action.call(store, store, payload);
      if (!isPromise(res)) {
        return Promise.resolve(res);
      }
      return res;
    });
  });

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}
function resetStoreState(store, state) {
  store._state = reactive({ data: state });
  const wrapedGetters = store._wrappedGetters;
  store.getters = {};
  forEachValue(wrapedGetters, (getter, key) => {
    Object.defineProperty(store.getters, key, {
      get: () => getter(),
      enumerable: true,
    });
  });
}
export default class Store {
  constructor(options) {
    const store = this;
    this._modules = new ModuleCollection(options);
    // console.log(this._modules);
    store._wrappedGetters = Object.create(null);
    store._mutations = Object.create(null);
    store._actions = Object.create(null);

    //定义状态
    const state = store._modules.root.state;
    //把状态定义到store.state,安装模块
    installModule(store, state, [], store._modules.root);
    resetStoreState(store, state);
  }
  //为什么必须箭头函数写法？
  commit = (type, payload) => {
    const entry = this._mutations[type] || [];
    entry.forEach((handler) => handler(payload));
  };
  dispatch = (type, payload) => {
    const entry = this._actions[type] || [];
    return Promise.all(entry.map((handler) => handler(payload)));
  };
  get state() {
    return this._state.data;
  }
  install(app, injectKey) {
    app.provide(injectKey || storeKey, this); //给根组件app 增加一个_provides，子组件会去向上查找
    app.config.globalProperties.$store = this; //增加$store属性
  }
}
