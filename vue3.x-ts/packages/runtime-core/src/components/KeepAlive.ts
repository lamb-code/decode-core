import { ShapeFlags } from "@vue/shared";
import { onMounted, onUpdated } from "../apiLifecycle";
import { getCurrentInstance } from "../component";

export const KeepAlive = {
  __isKeepAlive: true,
  setup(props, { slots }) {
    const keys = new Set(); // 用来记录哪些组件缓存过
    const cache = new Map(); //缓存表
    let pendingCahceKey = null;
    const instance = getCurrentInstance();
    const cacheSubTree = () => {
      cache.set(pendingCahceKey, instance.subTree); //缓存组件的虚拟节点，里面有组件的dom元素
    };
    const { move, createElement } = instance.ctx.renderer;
    instance.ctx.activated = (vnode, container, anchor) => {
      move(vnode, container, anchor);
    };
    const storageContent = createElement("div");
    (instance.ctx.deactivated = (vnode, container, anchor) => {
      move(vnode, storageContent, null);//将dom元素临时移动到这个div中 但是没有被销毁
    }),
      onMounted(cacheSubTree);
    onUpdated(cacheSubTree);
    return () => {
      const vnode = slots.default();
      //在这个组件中需要一些dom方法 可以将元素移动到div中
      //还可以卸载某个元素
      const comp = vnode.type;
      const key = vnode.key == null ? comp : vnode.key;
      const cacheNode = cache.get(key);
      pendingCahceKey = key;
      if (cacheNode) {
        vnode.component = cacheNode.component;
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE;
      } else {
        keys.add(key);
      }
      return vnode;
    };
  },
};
export const isKeepAlive = (value) => value.__isKeepAlive;
