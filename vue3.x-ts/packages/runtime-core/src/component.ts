import { proxyRefs, reactive } from "@vue/reactivity";
import { hasOwn, isFunction } from "@vue/shared";

export function createComponentInstance(vnode) {
  const instance = {
    data: null,
    vnode,
    subTree: null,
    isMounted: true,
    update: null,
    props: {},
    attrs: {},
    propsOptions: vnode.type.props, // 用户声明的那些属性是组件的属性
    component: null,
    proxy: null, //用来代理 props attrs data 让用户方便的取值
    setupState: null,
  };
  return instance;
}
const initProps = (instance, rawProps) => {
  const props = {};
  const attrs = {};
  const propsOptions = instance.propsOptions || {};
  if (rawProps) {
    for (let key in rawProps) {
      //用所有的props 区分props atrrs
      const value = rawProps[key];
      if (key in propsOptions) {
        props[key] = value;
      } else {
        attrs[key] = value;
      }
    }
  }
  instance.attrs = attrs;
  instance.props = reactive(props);
};
const publicProperty = {
  $attrs: (instance) => instance.attrs,
};
const handler = {
  get(target, key) {
    const { data, props,setupState } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    }else if(setupState&&hasOwn(setupState,key)){
      return setupState[key]
    }
    const getter = publicProperty[key];
    return getter && getter(target);
  },
  // 对于一些属性无法修改的属性如 $slot $attrs... 那就去实例上取
  set(target, key, value) {
    const { data, props,setupState } = target;
    if (data && hasOwn(data, key)) {
      data[key] = value;
    } else if (props && hasOwn(props, key)) {
      //我们可以修改属性中的嵌套属性(内部不会报错)  但是不合法
      // props[key] = value;
      console.warn("props is readonly");
      return false;
    }else if(setupState&&hasOwn(setupState,key)){
      setupState[key] = value;
    }
    return true;
  },
};
export function setupComponent(instance) {
  const { vnode } = instance;
  //赋值属性
  initProps(instance, vnode.props);
  //赋值代理对象
  instance.proxy = new Proxy(instance, handler);
  const { data = () => {}, render, setup } = vnode.type;

  if (setup) {
    const setupContext = {};
    const setupResult = setup(instance.props, setupContext);
    if (isFunction(setupResult)) {
      instance.render = setupResult;
    } else {
      instance.setupState = proxyRefs(setupResult);
    }
  }

  if (!isFunction(data)) return console.warn("function");
  instance.data = reactive(data.call(instance.proxy));
  if (!instance.render) {
    instance.render = render;
  }
  //instance.render = render;
}
