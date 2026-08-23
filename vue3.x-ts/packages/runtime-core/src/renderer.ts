import { hasOwn, ShapeFlags } from "@vue/shared";
import { Fragment, isSameVnode, Text } from "./createVnode";
import getSequence from "./seq";
import { reactive, ReactiveEffect } from "@vue/reactivity";
import { queueJob } from "./scheduler";
import { createComponentInstance, setupComponent } from "./component";

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
  const mountElement = (vnode, container, anchor) => {
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
    hostInsert(el, container, anchor);
  };
  const processElement = (n1, n2, container, anchor) => {
    if (n1 == null) {
      //初始化操作

      mountElement(n2, container, anchor);
    } else {
      patchElement(n1, n2, container);
    }
  };
  const processFragment = (n1, n2, container) => {
    if (n1 == null) {
      mountChildren(n2.children, container);
    } else {
      patchChildren(n1, n2, container);
    }
  };
  const processText = (n1, n2, container) => {
    if (n1 == null) {
      // 1.虚拟节点要关联真实节点
      // 2.将节点插入到页面中
      hostInsert((n2.el = hostCreateText(n2.children)), container);
    } else {
      const el = (n2.el = n1.el);
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  //初始化属性

  const setupRenderEffect = (instance, container, anchor) => {
    const { render } = instance;
    const componentUpdateFn = () => {
      //我们要在这区分是第一次还是之后的所以用到实例
      if (!instance.isMounted) {
        // const subTree = render.call(state, state);
        const subTree = render.call(instance.proxy, instance.proxy);
        instance.subTree = subTree;
        patch(null, subTree, container, anchor);
        instance.isMounted = true;
      } else {
        // const subTree = render.call(state, state);
        const subTree = render.call(instance.proxy, instance.proxy);

        patch(instance.subTree, subTree, container, anchor);
        instance.subTree = subTree;
      }
    };
    const effect = new ReactiveEffect(componentUpdateFn, () =>
      queueJob(update)
    );

    const update = (instance.update = () => {
      effect.run();
    });
    update();
  };
  const mountComponent = (vnode, container, anchor) => {
    //第一步先创建实例
    const instance = (vnode.component = createComponentInstance(vnode));

    //第二步给实例属性赋值
    setupComponent(instance);
    //第三步 创建一个effect
    setupRenderEffect(instance, container, anchor);
    //组件可以基于自己的状态重新渲染，就是一个effect
    // const { data = () => {}, render, props: propsOptions = {} } = vnode.type;
    // const state = reactive(data()); //组件的状态
    // const instance = {
    //   state,
    //   vnode,
    //   subTree: null,
    //   isMounted: true,
    //   update: null,
    //   props: {},
    //   attrs: {},
    //   propsOptions,
    //   component: null,
    //   proxy: null, //用来代理 props attrs data 让用户方便的取值
    // };
    // vnode.component = instance;
    // 根据propsOptions 区分props和attrs
    //元素更新的是 n2.el =>n1.el
    //组件更新的是 n2.component.subTree.el = n2.component.subTree.el
    // initProps(instance, vnode.props);

    //代理对象
    // const publicProperty = {
    //   $attrs: (instance) => instance.attrs,
    // };
    // instance.proxy = new Proxy(instance, {
    //   get(target, key) {
    //     const { state, props } = target;
    //     if (state && hasOwn(state, key)) {
    //       return state[key];
    //     } else if (props && hasOwn(props, key)) {
    //       return props[key];
    //     }
    //     const getter = publicProperty[key];
    //     return getter && getter(target);
    //   },
    //   // 对于一些属性无法修改的属性如 $slot $attrs... 那就去实例上取
    //   set(target, key, value) {
    //     const { state, props } = target;
    //     if (state && hasOwn(state, key)) {
    //       state[key] = value;
    //     } else if (props && hasOwn(props, key)) {
    //       //我们可以修改属性中的嵌套属性(内部不会报错)  但是不合法
    //       // props[key] = value;
    //       console.warn("props is readonly");
    //       return false;
    //     }
    //     return true;
    //   },
    // });

    // const componentUpdateFn = () => {
    //   //我们要在这区分是第一次还是之后的所以用到实例
    //   if (!instance.isMounted) {
    //     // const subTree = render.call(state, state);
    //     const subTree = render.call(instance.proxy, instance.proxy);

    //     instance.subTree = subTree;
    //     patch(null, subTree, container, anchor);
    //     instance.isMounted = true;
    //   } else {
    //     // const subTree = render.call(state, state);
    //     const subTree = render.call(instance.proxy, instance.proxy);

    //     patch(instance.subTree, subTree, container, anchor);
    //     instance.subTree = subTree;
    //   }
    // };
    // const effect = new ReactiveEffect(componentUpdateFn, () =>
    //   queueJob(update)
    // );

    // const update = (instance.update = () => {
    //   effect.run();
    // });
    // update();
  };
  const hasPropsChange = (prevProps, nextProps) => {
    let nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] != prevProps[key]) {
        return true;
      }
    }
    return false;
  };
  const updateProps = (instance, prevProps, nextProps) => {
    if (hasPropsChange(prevProps, nextProps)) {
      for (let key in nextProps) {
        instance.props[key] = nextProps[key];
      }
      for (let key in instance.props) {
        if (!(key in nextProps)) {
          delete instance.props[key];
        }
      }
    }
  };
  const updateComponent = (n1, n2) => {
    const instance = (n2.component = n1.component); //复用组件实例
    const { props: prevProps } = n1;
    const { props: nextProps } = n2;
    updateProps(instance, prevProps, nextProps);
  };
  const processComponent = (n1, n2, container, anchor) => {
    if (n1 === null) {
      mountComponent(n2, container, anchor);
    } else {
      //组件的更新
      updateComponent(n1, n2);
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
  const patchKeyedChildren = (c1, c2, el) => {
    //比较两个儿子的差异更新el
    let i = 0; //开始比对的索引
    let e1 = c1.length - 1; //第一个数组的尾部索引
    let e2 = c2.length - 1; //第二个数组尾部索引

    //从头开始比对
    while (i <= e1 && i <= e2) {
      // 有任何一方循环结束了 就要终止比较
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el); // 更新当前节点的属性和儿子（递归比较子节点）
      } else {
        break;
      }
      i++;
    }

    //从尾部开始比
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      // i =0
      // [a,b,c]  // e1 = 2
      // [d,a,b,c]; // e2 = 3
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el); // 更新当前节点的属性和儿子（递归比较子节点）
      } else {
        break;
      }
      e1--;
      e2--;
    }
    //新的多
    if (i > e1) {
      if (i <= e2) {
        // 有插入的部分
        // insert()
        let nextPos = e2 + 1; // 看一下当前下一个元素是否存在
        let anchor = c2[nextPos]?.el;
        while (i <= e2) {
          patch(null, c2[i], el, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      if (i <= e1) {
        while (i <= e1) {
          unmount(c1[i]); // 将元素一个个删除
          i++;
        }
      }
    } else {
      // 以上确认不变化的节点，并且对插入和移除做了处理

      // 后面就是特殊的比对方式了

      let s1 = i;
      let s2 = i;
      const keyToNewIndexMap = new Map(); // 做一个映射表用于快速查找， 看老的是否在新的里面还有，没有就删除，有的话就更新
      let toBePatched = e2 - s2 + 1; // 要倒序插入的个数

      let newIndexToOldMapIndex = new Array(toBePatched).fill(0);

      //循环新的
      for (let i = s2; i <= e2; i++) {
        const vnode = c2[i];
        keyToNewIndexMap.set(vnode.key, i);
      }
      //循环旧的
      for (let i = s1; i <= e1; i++) {
        const vnode = c1[i];
        const newIndex = keyToNewIndexMap.get(vnode.key); // 通过key找到对应的索引
        if (newIndex == undefined) {
          // 如果新的里面找不到则说明老的有的要删除掉
          unmount(vnode);
        } else {
          // 比较前后节点的差异，更新属性和儿子
          // 我们i 可能是0的情况，为了保证0 是没有比对过的元素，直接 i+1
          newIndexToOldMapIndex[newIndex - s2] = i + 1; // [5,3,4,0]
          patch(vnode, c2[newIndex], el); // 服用
        }
      }
      // 调整顺序
      // 我们可以按照新的队列 倒序插入insertBefore 通过参照物往前面插入

      // 插入的过程中，可能新的元素的多，需要创建

      // 先从索引为3的位置倒序插入
      let increasingSeq = getSequence(newIndexToOldMapIndex);
      let j = increasingSeq.length - 1; // 索引

      for (let i = toBePatched - 1; i >= 0; i--) {
        // 3 2 1 0
        let newIndex = s2 + i; // h 对应的索引，找他的下一个元素作为参照物，来进行插入
        let anchor = c2[newIndex + 1]?.el;
        let vnode = c2[newIndex];
        if (!vnode.el) {
          // 新列表中新增的元素
          patch(null, vnode, el, anchor); // 创建h插入
        } else {
          if (i == increasingSeq[j]) {
            j--; // 做了diff算法有的优化
          } else {
            hostInsert(vnode.el, el, anchor); // 接着倒序插入
          }
        }
      }
      // 倒序比对每一个元素，做插入操作
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
          patchKeyedChildren(c1, c2, el);
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
  const patch = (n1, n2, container, anchor = null) => {
    if (n1 == n2) return;
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null; //后续会执行n2的初始化
    }
    const { type, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      case Fragment:
        processFragment(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor);
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container, anchor);
        }
    }
  };
  const unmount = (vnode) => {
    if (vnode.type == Fragment) {
      unmountChildren(vnode.children);
    } else {
      hostRemove(vnode.el);
    }
  };
  //多次调用render 会进行虚拟节点比较 在进行更新
  const render = (vnode, container) => {
    // console.log(vnode, "vnode", container);
    if (vnode == null) {
      //我要移除当前容器的dom元素
      if (container._vnode) {
        // console.log(container._vnode);
        unmount(container._vnode);
      }
    } else {
      patch(container._vnode || null, vnode, container);
      container._vnode = vnode;
    }
  };
  return { render };
}
