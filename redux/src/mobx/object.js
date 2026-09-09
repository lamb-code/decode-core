import { $mobx, addHiddenProp, getAdm, getNextId } from "./utils";
// import { asObservableObject } from "mobx/dist/internal"
class ObservableValue {
  constructor(value) {
    this.value = value;
  }
  get() {
    return this.value;
  }
  setNewValue(newValue) {
    this.value = newValue;
  }
}
class ObservableArrayAdministration {
  constructor(target, values, name) {
    this.target = target;
    this.values = values;
    this.name = name;
  }
  get(key) {
    return this.target[key];
  }
  set(key, value) {
    return (this.target[key] = value);
  }
  extend(key, descriptor) {
    this.defineObservableProperty(key, descriptor.value);
  }
  getObservablePropValue(key) {
    return this.values.get(key).get()
  }
  setObservablePropValue(key, value) {
    const observableValue = this.values.get(key)
    observableValue.setNewValue(value)
    return true
  }
  defineObservableProperty(key,value) {
    const descriptor = {
      configurable: true,
      enumerable: true,
      get() {
        return this[$mobx].getObservablePropValue(key);
      },
      set() {
        return this[$mobx].setObservablePropValue(key, value);
      },
    };
    Object.defineProperty(this.target, key, descriptor);
    this.values.set(key, new ObservableValue(value));
  }
}
function asObservableObject(target) {
  const name = `ObserableObject${getNextId()}`;
  const adm = new ObservableArrayAdministration(target, new Map(), name);
  addHiddenProp(target, $mobx, adm);
  return target;
}
const objectProxyTraps = {
  get(target, name) {
    return getAdm(target).get(name);
  },
  set(target, name, value) {
    return getAdm(target).set(name, value);
  },
};
function asDynamicObservableObject(target) {
  asObservableObject(target);
  const proxy = new Proxy(target, objectProxyTraps);
  return proxy;
}
function extendObservable(proxyObject, properties) {
  const descriptors = Object.getOwnPropertyDescriptors(properties);
  const adm = getAdm(proxyObject);
  Reflect.ownKeys(descriptors).forEach((key) => {
    adm.extend(key, descriptors[key]);
  });
  return proxyObject
}
export function object(target) {
  const dynamicObservableObject = asDynamicObservableObject({});
  return extendObservable(dynamicObservableObject, target);
}
