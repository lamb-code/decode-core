import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vdom";
function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag == "string") {
    vnode.el = document.createElement(tag);
    patchProps(vnode.el, data);
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
function patchProps(el, props) {
  for (let key in props) {
    if (key === "style") {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
function patch(oldVNode, vnode) {
  //   console.log(oldVNode, vnode, "............");
  const isRealElement = oldVNode.nodeType;
  //写的还是初渲染
  if (isRealElement) {
    const ele = oldVNode;
    const parentEle = ele.parentNode;
    const newElm = createElm(vnode);
    // console.log(newElm, "newElm");
    parentEle.insertBefore(newElm, ele.nextSibling);
    parentEle.removeChild(ele);
    return newElm;
  } else {
    //diff算法
  }
}
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;
    // console.log("vnode:", el);

    // patch既有初始化的功能 又有更新的功能
    vm.$el = patch(el, vnode);
  };
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (value) {
    if (typeof value !== "object") return value;
    return JSON.stringify(value);
  };

  Vue.prototype._render = function () {
    const vm = this;
    const vnode = vm.$options.render.call(vm);
    return vnode;
  };
}
export function mountComponent(vm, el) {
  //挂载元素分三步：
  vm.$el = el;
  const updateComponent = () => {
    //1. 调用render方法生成虚拟DOM

    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, true);

  //2.根据虚拟DOM生成真实DOM
  //3.插入到el元素中
}
export function callHook(vm, hook) {
  let handlers = vm.$options[hook];
  if (handlers) {
    handlers.forEach((fn) => {
      fn.call(vm); // 生命周期的this 永远指向实例
    });
  }
}
