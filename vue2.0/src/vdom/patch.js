import { isSameVnode } from ".";

export function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag == "string") {
    vnode.el = document.createElement(tag);
    patchProps(vnode.el, {}, data);
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
export function patchProps(el, oldProps = {}, props = {}) {
  // 老的属性中有新的没有要删除老的
  let oldStyles = oldProps.style || {};
  let newStyles = props.style || {};
  //处理样式
  for (let key in oldStyles) {
    if (!newStyles[key]) {
      el.style[key] = "";
    }
  }
  for (let key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(key);
    }
  }
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
export function patch(oldVNode, vnode) {
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
    //1.两个节点不是同一个节点，直接删除老的换上新的，（没有比对了）
    //2.两个节点时同一个节点(判断节点的tag和节点的key)比较两个节点的属性是否有差异，(复用老的节点，将差异的属性更换)
    //3.节点比较完毕后就需要比较两人的子元素
    return patchVnode(oldVNode, vnode);
  }
}
function patchVnode(oldVNode, vnode) {
  if (!isSameVnode(oldVNode, vnode)) {
    //不是同一节点直接替换
    let el = createElm(vnode);
    oldVNode.el.parentNode.replaceChild(el, oldVNode.el);
    return el;
  }
  let el = (vnode.el = oldVNode.el); //复用老节点dom元素
  if (!oldVNode.tag) {
    //文本情况
    if (oldVNode.text !== vnode.text) {
      oldVNode.el.textContent = vnode.text;
    }
  }
  //标签情况 是标签我们需要比对标签的属性
  patchProps(el, oldVNode.data, vnode.data);

  //比较儿子
  //1. 一方有儿子一方没有儿子2.两方都有儿子
  let oldChildren = oldVNode.children || [];
  let newChildren = vnode.children || [];
  if (oldChildren.length > 0 && newChildren.length > 0) {
    //完整的diff算法需要比较两个儿子
    updateChildren(el, oldChildren, newChildren);
  } else if (newChildren.length > 0) {
    mountChildren(el, newChildren);
  } else if (oldChildren.length > 0) {
    // unMountChildren(el,oldChildren)
    el.innerHtml = "";
  }
  return el;
}
function mountChildren(el, children) {
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    el.appendChild(createElm(child));
  }
}
function updateChildren(el, oldChildren, newChildren) {
  //vue2采用双指针的方式比较两个节点
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let newEndIndex = newChildren.length - 1;
  let oldStartVnode = oldChildren[0];
  let newStartVnode = newChildren[0];
  let oldEndVnode = oldChildren[oldEndIndex];
  let newEndVnode = newChildren[newEndIndex];
  function makeIndexByKey(children) {
    let map = {};
    children.forEach((child, index) => {
      map[child.key] = index;
    });
    return map;
  }
  let map = makeIndexByKey(oldChildren);
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }
    //比较结尾节点
    else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
    //交叉比较
    else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode);
      el.insertBefore(oldEndVnode.el, newStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode);
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else {
      //乱序比对
      //根据老的列表做一个映射关系，用新的去找，找到则一定，找不到则添加，最后多余就删除
      let moveIndex = map(newStartVnode.key);
      if (moveIndex !== undefined) {
        let moveVnode = oldChildren[moveIndex];
        el.insertBefore(moveVnode.el, oldStartVnode.el);
        oldChildren[moveIndex] = undefined; //表明这个子节点已移走了
        patchVnode(moveVnode, newStartVnode);
      } else {
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let childEl = createElm(newChildren[i]);
      let anchor = newChildren[newEndIndex + 1]
        ? newChildren[newEndIndex + 1].el
        : null;
      //   el.appendChild(childEl);
      el.insertBefore(childEl, anchor);
    }
  }
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i]) {
        let childEl = oldChildren[i].el;
        el.removeChild(childEl);
      }
    }
  }

}
