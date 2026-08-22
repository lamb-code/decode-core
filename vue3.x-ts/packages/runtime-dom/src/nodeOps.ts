//主要是对节点元素的增删改查
export const nodeOps = {
  createElement(type) {
    return document.createElement(type);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  //如果第三个参数不传递等价于 appendChild
  insert(el, parent, anchor) {
    // parent.appendChild(el)
    parent.insertBefore(el, anchor || null);
  },
  remove(el) {
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  },
  createText: (text) => document.createTextNode(text),
  setText: (node, text) => (node.nodeValue = text),
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
};
