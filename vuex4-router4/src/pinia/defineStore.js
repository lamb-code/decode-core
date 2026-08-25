import {
  computed,
  effectScope,
  getCurrentInstance,
  inject,
  reactive,
  toRefs,
} from "vue";
import { SymbolPinia } from "./rootState";

export function defineStore(idOrOptions, setup) {
  let id;
  let options;
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  const isSetupStore = typeof setup === "function";
  function useStore() {
    const currentInstance = getCurrentInstance();
    const pinia = currentInstance && inject(SymbolPinia); //必须在组件里才能使用
    console.log(pinia);
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  return useStore;
}
function createSetupStore(id, setup, pinia) {
  const store = reactive({});
  let scope;

  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });

  function wrapAction(key, action) {
    return function () {
      //触发action的时候，可以触发一些额外的逻辑
      let res = action.apply(store, arguments);
      return res;
    };
  }
  for (let key in setupStore) {
    let prop = setupStore[key];
    if (typeof prop === "function") {
      setupStore[key] = wrapAction(key, prop);
    }
  }
  //最终会将处理好的setupStore放到store身上
  Object.assign(store, setupStore);
  pinia._s.set(id, store);
  return store
}
function createOptionsStore(id, options, pinia) {
  let { state, getters, actions } = options;
  function setup() {
    pinia.state.value[id] = state ? state() : {};
    // const localState = pinia.state.value[id];
    const localState = toRefs(pinia.state.value[id]);

    return Object.assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetter, key) => {
        computedGetter[key] = computed(() => {
          return getters[key].call(store, store); //这返回的是普通值不具响应式 需要把localstate toRefs包裹下
        });
        return computedGetter;
      }, {})
    );
  }
  //_e能停止所有的store
  //每个store还能停止自己的
  const store =  createSetupStore(id,setup,pinia)
  return store
}
