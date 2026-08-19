import { activeEffect, triggerEffects } from "./effect";
const targetMap = new WeakMap(); //存放搜集依赖的关系
export const createDep = (cleanup, key) => {
  const dep = new Map() as any;
  dep.cleanup = cleanup;
  dep.name = key;
  return dep;
};
export function track(target, key) {
  //  activeEffect 有值 说明这个key是在effect中访问的，没有则说明是在effect之外访问的
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      //   depsMap.set(key, new Map());
      depsMap.set(key, (dep = createDep(() => depsMap.delete(key), key)));
    }
    console.log(targetMap);
  }
}
export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    triggerEffects(dep);
  }
}
