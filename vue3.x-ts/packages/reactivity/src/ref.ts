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
  let dep = ref.dep;
  if (dep) {
    triggerEffects(dep);
  }
}
class ObjectRefImpl {
  constructor(public _object, public _key) {}
  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
}
export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}
export function toRefs(object) {
  const res = {};

  for (let key in object) {
    res[key] = toRef(object, key);
  }
  return res;
}
export function proxyRefs(objectWithRef) {
  return new Proxy(objectWithRef, {
    get(target, key, recevier) {
      let r = Reflect.get(target, key, recevier);
      return r.__v_isRef ? r.value : r;
    },
    set(target, key, value, recevier) {
      const oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true
      } else {
        return Reflect.set(target, key, value, recevier);
      }
    },
  });
}
