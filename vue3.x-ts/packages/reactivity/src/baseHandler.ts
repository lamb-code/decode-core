import { activeEffect } from "./effect";
import { track } from "./reactiveEffect";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

export const mutableHandlers: ProxyHandler<any> = {
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
    //取值的时候怎么搜集effect? 使用一个全局变量activeEffect
    // console.log(activeEffect,key)
    track(target,key)
    // return target[key];// 不能直接返回 target[key]
    return Reflect.get(target,key,recevier) //proxy 需要搭配reflect来使用
    //当取值的时候 应该让响应式属性和effect 映射起来
  },
  set(target, key, value, recevier) {
    return Reflect.set(target,key,value,recevier)

  },
};
