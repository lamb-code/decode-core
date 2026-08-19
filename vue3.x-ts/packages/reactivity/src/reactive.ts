import { isObject } from "@vue/shared";

/*
 *reactiveMap用于记录我们的代理后的结果可以复用如:
 * let obj={name:'jane'}
 * const state1=reactive(obj)
 * const state2=reactive(obj)
 * consloe.log(state1===state2) =>false
 */
const reactiveMap = new WeakMap();

enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

const mutableHandlers: ProxyHandler<any> = {
  get(target, key, recevier) {
    /*
     *判断是否代理过了，代理过了就直接取值:
     * let obj={name:'jane'}
     * const state1=reactive(obj)
     * const state2=reactive(state1)
     * consloe.log(state1===state2) =>false
     * 在reactive方法尝试取IS_REACTIVE属性如果存在就说明已经代理过了
     */
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
  },
  set(target, key, value, recevier) {
    return true;
  },
};
export function reactive(target) {
  return createReactiveObject(target);
}
function createReactiveObject(target) {
  if (!isObject(target)) {
    return target;
  }
  //尝试取IS_REACTIVE属性如果存在就说明已经代理过了
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) return exitsProxy;
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy); //根据对象缓存代理后的结果
  return proxy;
}
