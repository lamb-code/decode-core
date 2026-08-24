import { getCurrentInstance } from "../component";
import { h } from "../h";
/* enterFrom  enterActive  enterTo     leaveFrom leaveActive  leaveTo */
function nextFrame(fn) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}
export function resolveTransitionProps(props) {
  const {
    name = "v",
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`,
    onBeforeEnter,
    onEnter,
    onLeave,
  } = props;
  return {
    onBeforeEnter(el) {
      onBeforeEnter && onBeforeEnter(el);
      el.classList.add(enterFromClass);
      el.classList.add(enterActiveClass);
    },
    onEnter(el, done) {
      const resolve = () => {
        el.classList.remove(enterToClass);
        el.classList.remove(enterActiveClass);
        done && done();
      };
      onEnter && onEnter(el, resolve);
      // 添加后，在移除，而不是马上移除
      // el.classList.remove(enterFromClass);

      nextFrame(() => {
        el.classList.remove(enterFromClass);
        el.classList.add(enterToClass);
        if (!onEnter || onEnter.length <= 1) {
          //onEnter.length 表示函数参数的个数
          el.addEventListener("transitionEnd", resolve);
        }
      });
    },
    onLeave(el, done) {
      const resolve = () => {
        el.classList.remove(leaveActiveClass);
        el.classList.remove(leaveToClass);
        done && done();
      };
      onLeave && onLeave(el, resolve);

      el.classList.add(leaveFromClass);
      document.body.offsetHeight; // 立刻绘制成黄色

      el.classList.add(leaveActiveClass);
      nextFrame(() => {
        el.classList.remove(leaveFromClass);
        el.classList.add(leaveToClass);
        if (!onLeave || onLeave.length <= 1) {
          //onLeave.length 表示函数参数的个数
          el.addEventListener("transitionend", resolve);
        }
      });
    },
  };
}
export function Transition(props, { slots }) {
  console.log(slots);
  //函数式组件的功能比较少，为了方便函数式组件处理属性
  // 处理属性后传递给 状态组件 setup
  return h(BaseTransitionImpl, resolveTransitionProps(props),slots);
}
const BaseTransitionImpl = {
  props: {
    onBeforeEnter: Function,
    onEnter: Function,
    onLeave: Function,
  },
  setup(props, { slots }) {
    return () => {
      // const {}=props
      const vnode = slots.default && slots.default();
      const instance = getCurrentInstance();
      if (!vnode) return;
      //渲染前(离开) 渲染后(进入)
      // const oldVnode = instance.subTree //之前的虚拟节点
      vnode.transition = {
        beforeEnter: props.onBeforeEnter,
        enter: props.onEnter,
        leave: props.onLeave,
      };
      return vnode;
    };
  },
};
