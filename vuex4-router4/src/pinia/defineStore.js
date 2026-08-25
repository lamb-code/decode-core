import { effectScope, getCurrentInstance, inject, reactive } from "vue";
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
  function useStore() {
    const currentInstance = getCurrentInstance();
    const pinia = currentInstance && inject(SymbolPinia); //必须在组件里才能使用
    console.log(pinia);
    if (!pinia._s.has(id)) {
      createOptionsStore(id, options, pinia);
    }
    const store = pinia._s.get(id)
    return store
  }
  return useStore;
}
function createOptionsStore(id, options, pinia) {
  let { state, getters, actions } = options;
  let scope;
  const store = reactive({})
  function setup() {
    pinia.state.value[id] = state ? state() : {};
    const localState = pinia.state.value[id]
    return localState
  }
  //_e能停止所有的store
  //每个store还能停止自己的
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });

  Object.assign(store,setupStore)
  pinia._s.set(id,store)
  console.log(store)
}
