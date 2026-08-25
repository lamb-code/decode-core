import {
  computed,
  effectScope,
  getCurrentInstance,
  inject,
  isRef,
  reactive,
  toRefs,
  watch,
} from "vue";
import { SymbolPinia } from "./rootState";
import { addSubcription, triggerSubscription } from "./pubSub";
function mergeReactiveObject(target, source) {
  for (let key in source) {
    if (!source.hasOwnProperty(key)) continue;
    const oldValue = target[key];
    const newValue = source[key];
    if (isObject(oldValue) && isObject(newValue) && isRef(newValue)) {
      target[key] = mergeReactiveObject(oldValue, newValue);
    } else {
      target[key] = newValue;
    }
  }
  return target;
}

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
  let scope;

  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });

  function wrapAction(key, action) {
    return function () {
      const afterCallbacks = [];
      const onErrorCallbacks = [];
      function after(callback) {
        afterCallbacks.push(callback);
      }
      function onError(callback) {
        onErrorCallbacks.push(callback);
      }
      triggerSubscription(actionSubscribes, { after, onError, store, key });
      let res;
      try {
        res = action.apply(store, arguments);
      } catch (error) {
        triggerSubscription(onErrorCallbacks, error);
      }
      //触发action的时候，可以触发一些额外的逻辑
      if (res instanceof Promise) {
        return res
          .then((value) => {
            triggerSubscription(afterCallbacks, value);
          })
          .catch((error) => {
            triggerSubscription(onErrorCallbacks, error);
            return Promise.reject(error);
          });
      } else {
        triggerSubscription(afterCallbacks, res);
      }
      return res;
    };
  }
  for (let key in setupStore) {
    let prop = setupStore[key];
    if (typeof prop === "function") {
      setupStore[key] = wrapAction(key, prop);
    }
  }

  function $patch(args) {
    if (typeof args === "function") {
      args(store);
    } else {
      mergeReactiveObject(store, args);
    }
  }
  let actionSubscribes = [];
  const partialStore = {
    $patch,
    $subscribe(callback, options) {
      scope.run(() =>
        watch(
          pinia.state.value[id],
          (state) => {
            callback({ type: "dirct" }, state);
          },
          options
        )
      );
    },
    $onAction: addSubcription.bind(null, actionSubscribes),
    $dispose: () => {
      scope.stop();
      actionSubscribes = [];
      pinia._s.delete(id);
    },
  };
  const store = reactive(partialStore);
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[id],
    set: (state) => this.$patch(($state) => Object.assign($state, state)),
  });
  //最终会将处理好的setupStore放到store身上
  Object.assign(store, setupStore);
  pinia._p.forEach(plugin=>Object.assign(store,plugin({store,pinia,app:pinia._a})))
  pinia._s.set(id, store);
  return store;
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
  const store = createSetupStore(id, setup, pinia);
  //$reset只能在非setupstore写法中
  store.$reset = function () {
    const newState = state ? state() : {};
    store.$patch(($state) => {
      Object.assign($state, newState);
    });
  };
  return store;
}
