import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref";

export function watch(source, cb, options = {} as any) {
  //watchEffect也是基于这个方法实现
  return doWatch(source, cb, options);
}
export function watchEffect(getter, options = {}) {
  //没有cb就是watchEffect
  return doWatch(getter, null, options as any);
}
//用depth控制遍历到第几层
function traverse(source, depth, currentDepth = 0, seen = new Set()) {
  if (!isObject(source)) {
    return source;
  }
  //如果当前深度
  if (depth) {
    if (currentDepth >= depth) {
      return source;
    }
    currentDepth++; //根据deep 属性来判断是否是深度
  }
  if (seen.has(source)) {
    return source;
  }
  for (let key in source) {
    traverse(source[key], depth, currentDepth, seen);
  }
  return source;
}
function doWatch(source, cb, { deep, immediate }) {
  const reactiveGetter = (source) =>
    traverse(source, deep === false ? 1 : undefined);
  //产生一个可以给ReactiveEffect 来使用的getter 需要对这个对象进行取值操作，会关联当前的reactiveEffect
  let getter;
  if (isReactive(source)) {
    getter = () => reactiveGetter(source);
  } else if (isRef(source)) {
    getter = () => source;
  } else if (isFunction(source)) {
    getter = source;
  }

  let oldValue;
  let clean;
  const onCleanup = (fn) => {
    clean = () => {
      fn();
      clean = undefined;
    };
  };
  const job = () => {
    if (cb) {
      const newValue = effect.run();
      if (clean) {
        clean();
      }
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    } else {
      effect.run();
    }
  };
  const effect = new ReactiveEffect(getter, job);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else {
    effect.run();
  }
  const unWatch = () => {
    effect.stop();
  };
  return unWatch;
}
