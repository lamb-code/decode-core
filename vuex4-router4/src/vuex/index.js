import { inject, reactive } from "vue";

const storeKey = "store";

class Store {
  constructor(options) {
    //vuex3 内部会创建一个vue实例 但是vuex4直接采用vue3提供的响应式方法
    const store = this;
    store._state = reactive({ data: options.state }); //为什么包一层？ vuex 里面有一个比较的api replaceState
    // this.state = options.state;
  }
  get state() {
    return this._state.data;
  }
  install(app, injectKey) {
    app.provide(injectKey || storeKey, this);//给根组件app 增加一个_provides，子组件会去向上查找
    app.config.globalProperties.$store = this; //增加$store属性
  }
}

export function createStore(options) {
  return new Store(options);
}

export function useStore(injectKey = storeKey) {
  return inject(injectKey);
}
