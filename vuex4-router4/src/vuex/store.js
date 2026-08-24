import { reactive } from "vue";
import { forEachValue } from "./utils";
import { storeKey } from "./injectKey";
import ModuleCollection from "./module/module-collection";
function installModule(store, rootState, path, module) {
  let isRoot = !path.length; // 如果数组是空说明是根否则不是
  if (!isRoot) {
    let parentState = path
      .slice(0, -1)
      .reduce((state, key) => state[key], rootState);
    parentState[path[path.length - 1]] = module.state;
  }

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}
export default class Store {
  constructor(options) {
    const store = this;
    this._modules = new ModuleCollection(options);
    console.log(this._modules);
    //定义状态
    const state = store._modules.root.state;
    //把状态定义到store.state,安装模块
    installModule(store, state, [], store._modules.root);
  }
  //为什么必须箭头函数写法？
  commit = (type, payload) => {
    this._mutations[type](payload);
  };
  dispatch = (type, payload) => {
    this._actions[type](payload);
  };
  get state() {
    return this._state.data;
  }
  install(app, injectKey) {
    app.provide(injectKey || storeKey, this); //给根组件app 增加一个_provides，子组件会去向上查找
    app.config.globalProperties.$store = this; //增加$store属性
  }
}
