import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";
class ComputedRefImpl {
  public _value;
  public effect;
  constructor(getter, public setter) {
    //需要创建个effect
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        //计算属性依赖的值变化了，我们应该触发渲染effect重新执行,还需要将dirty属性变脏
        triggerRefValue(this)
      }
    );
  }
  get value(){
    if(this.effect.dirty){
        this._value = this.effect.run()
        trackRefValue(this)
        //如果当前在effect中访问了计算属性，计算属性是可以收集这个effect
    }
    return this._value
  }
  set value(v){
    this.setter(v)
  }
}

export function computed(getterOrOptions) {
  let onlyGetter = isFunction(getterOrOptions);
  let getter;
  let setter;
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {};
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  console.log(getter, setter);
  return new ComputedRefImpl(getter, setter);
}
