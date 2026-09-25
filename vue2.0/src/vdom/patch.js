export function createElm(vnode) {
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
export function patchProps(el, oldProps, props) {
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
  }
}
