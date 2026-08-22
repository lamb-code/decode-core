import { ShapeFlags } from "@vue/shared";
import { isSameVnode } from "./createVnode";

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
    //第一次渲染的时候让虚拟节点和真实DOM创建关联，第二次渲染新的vnodek可以和上一次的vnode做比对，之后更新对应的el元素 可以后续复用这个dom元素
    let el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (let key in props) {
        console.log(key);
        hostPatchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }
    hostInsert(el, container);
  };
  const processElement = (n1, n2, container) => {
    if (n1 == null) {
      //初始化操作

      mountElement(n2, container);
    } else {
      patchElement(n1, n2, container);
    }
  };
  const patchProps = (oldProps, newProps, el) => {
    //新的属性全部生效
    for (let key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }
    for (let key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      unmount(child);
    }
  };
  const patchChildren = (n1, n2, el) => {
    //子节点三种情况 文本 数组 和 null
    // 新文本  旧数组  → 删除所有旧子节点，设置文本
    // 2. 新文本  旧文本  → 更新文本
    // 3. 新文本  旧空   → 设置文本
    // 4. 新数组  旧数组  → 数组 diff（patchKeyedChildren）
    // 5. 新数组  旧文本  → 清空文本，挂载数组子节点
    // 6. 新数组  旧空   → 挂载数组子节点
    // 7. 新空   旧数组  → 删除全部旧子节点
    //  8. 新空   旧文本  → 清空文本
    //  9. 新空   旧空   → 无需处理
    const c1 = n1.children;
    const c2 = n2.children;
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    // ---------------------- 分支1：新子节点是文本 ----------------------
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 场景：新儿子=文本，旧儿子=数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1);
      }
      // 新旧文本内容不一样的时候，才更新DOM文本，避免不必要渲染
      // 覆盖两种场景：新文本+旧文本、新文本+旧空
      if (c1 !== c2) {
        hostSetElementText(el, c2);
      }
    }
    // ---------------------- 分支2：新子节点为【数组】或者【空】 ----------------------
    else {
      // 判断旧儿子是不是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //场景：旧数组，新数组 → 执行完整key diff算法比对子节点
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //diff算法
        } else {
          unmountChildren(c1);
        }
      }
      //旧儿子：文本 / 空
      else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          //场景：旧儿子=文本，先清空父元素上的旧文本
          hostSetElementText(el, "");
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //场景1：旧文本 + 新数组
          //场景2：旧空 + 新数组
          //挂载新的数组子节点
          mountChildren(c2, el);
        }
      }
    }
  };
  const patchElement = (n1, n2, container) => {
    //比较元素的差异 肯定需要复用dom元素
    // 比较属性和元素的子节点
    let el = (n2.el = n1.el);
    let oldProps = n1.props || {};
    let newProps = n2.props || {};
    //属性比对
    patchProps(oldProps, newProps, el);
    //子节点比对
    patchChildren(n1, n2, el);
  };
  const patch = (n1, n2, container) => {
    if (n1 == n2) return;
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null; //后续会执行n2的初始化
    }
    processElement(n1, n2, container);
  };
  const unmount = (vnode) => hostRemove(vnode.el);
  //多次调用render 会进行虚拟节点比较 在进行更新
  const render = (vnode, container) => {
    // console.log(vnode, "vnode", container);
    if (vnode == null) {
      //我要移除当前容器的dom元素
      if (container._vnode) {
        // console.log(container._vnode);
        unmount(container._vnode);
      }
    }
    patch(container._vnode || null, vnode, container);
    container._vnode = vnode;
  };
  return { render };
}
