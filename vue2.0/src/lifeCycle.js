import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode, isSameVnode } from "./vdom";
import { createElm, patch } from "./vdom/patch";



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
