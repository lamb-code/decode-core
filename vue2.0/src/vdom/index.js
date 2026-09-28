const isReservedTag = (tag) => {
  return ["a", "div", "span", "button", "ul", "li", "p"].includes(tag);
};

export function createElementVNode(vm, tag, data, ...children) {
  if (data == null) {
    data = {};
  }
  let key = data.key;
  if (key) {
    delete data.key;
  }
  if (isReservedTag(tag)) {
    return vnode(vm, tag, key, data, children);
  } else {
    let Ctor = vm.$options.components[tag]; //Ctor 可能是一个构造函数 可能是一个对象
    return createComponentVnode(vm, tag, key, data, children, Ctor);
  }
}
function createComponentVnode(vm, tag, key, data, children, Ctor) {
  if (typeof Ctor === "object") {
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    init(vnode) {
      //稍后创建真实DOM节点的时候，如果是组件则调用此init方法
      let instance = vnode.componentInstance = new vnode.componentOptions.Ctor()
      // instance.$mount()
    },
  };
  return vnode(vm, tag, key, data, children, null, { Ctor });
}
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}
function vnode(vm, tag, key, data, children, text, componentOptions) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
    componentOptions, //组件的构造函数
  };
}

export function isSameVnode(vnode1, vnode2) {
  return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
}
