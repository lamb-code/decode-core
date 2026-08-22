/**
 * 行内样式补丁
 * @param {HTMLElement} el - DOM元素
 * @param {Object|null} prevValue - 旧样式对象
 * @param {Object|null} nextValue - 新样式对象；null代表清空全部行内样式
 * 思路原理:
 * 1.新增 / 覆盖：遍历新样式对象 nextValue，把所有新样式直接设置到 DOM 的行内样式上；
 * 2.清理废弃样式：拿旧样式 prevValue 做对照；如果某个旧样式属性，在新样式里面消失了（值为 null /undefined），就把这条行内样式删掉。
 */

export default function patchStyle(el, prevValue, nextValue) {
  let style = el.style;
  // 新样式为null：清空全部旧样式，直接return
  if (nextValue == null) {
    if (prevValue) {
      for (const key in prevValue) {
        style[key] = null;
      }
    }
    return;
  }
  for (let key in nextValue) {
    style[key] = nextValue[key];
  }
  if (prevValue) {
    for (let key in prevValue) {
      if (nextValue[key] == null) {
        style[key] = null;
      }
    }
  }
}
