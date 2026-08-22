import { ShapeFlags } from "@vue/shared";

/**
 * createRenderer 【渲染器工厂函数】
 * @param {Object} renderOptions 宿主平台原生操作集合(nodeOps + patchProp)
 * 核心设计原理：平台无关、内核与宿主API解耦、依赖注入
 *   1、跨平台能力：渲染内核逻辑一套代码，可跑浏览器/小程序/uni-app
 *   2、依赖注入：不直接操作document，所有DOM方法从外部 renderOptions 传入
 *   3、闭包缓存：hostXXX 宿主方法被闭包保存，内部所有函数都可以直接调用
 *   4、对外只暴露 render 接口，内部patch/mountElement/mountChildren全部私有
 */
export function createRenderer(renderOptions) {
  // ========== 1、解构宿主环境操作API，host前缀约定：host=宿主(浏览器) ==========
  // 内核永远不直接调用 document.createElement，全部调用注入进来的方法
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp,
  } = renderOptions;
  /**
   * mountChildren：批量递归挂载子虚拟节点
   *@param {Array} children 子vnode数组
   * @param {HTMLElement} container 父真实DOM容器
   * 原理：子节点是数组，遍历每一个vnode，交给patch去挂载
   * n1传 null 代表：子节点全部都是新节点，没有旧节点，直接执行新增
   */
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container);
    }
  };
  /**
   * mountElement 【挂载普通元素节点】
   * @param {Object} vnode 新的虚拟节点
   * @param {HTMLElement} container 父容器真实DOM
   * 职责：vnode -> 生成真实DOM，处理属性、处理子节点、插入页面
   * 仅在首次渲染(n1===null)时调用，更新阶段不走这里，走diff对比逻辑
   */
  const mountElement = (vnode, container) => {
    const { type, children, props, shapeFlag } = vnode;
    let el = hostCreateElement(type);
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null);
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }
    hostInsert(el, container);
  };
  const patch = (n1, n2, container) => {
    if (n1 == n2) return;
    if (n1 == null) {
      //初始化操作
      mountElement(n2, container);
    }
  };
  //多次调用render 会进行虚拟节点比较 在进行更新
  const render = (vnode, container) => {
    console.log(vnode, "vnode", container);
    patch(container._vnode || null, vnode, container);
  };
  return { render };
}
