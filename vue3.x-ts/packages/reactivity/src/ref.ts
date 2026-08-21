import { activeEffect, trackEffect, triggerEffects } from "./effect";
import { toReactive } from "./reactive";
import { createDep } from "./reactiveEffect";

export function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
class RefImpl {
  public __v_isRef = true; //增加ref标识
  public _value; //用来保存ref的值
  public dep; // 搜集依赖
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    if (newVal !== this.rawValue) {
      this.rawValue = newVal;
      this._value = newVal;
      triggerRefValue(this);
    }
  }
}
function trackRefValue(ref) {
  if (activeEffect) {
    trackEffect(
      activeEffect,
      (ref.dep = createDep(() => (ref.dep = undefined), "undefined"))
    );
  }
}
function triggerRefValue(ref) {
    let dep = ref.dep
    if(dep){
        triggerEffects(dep)
    }
}
