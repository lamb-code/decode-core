/**
 * 属性补丁 - 更新DOM的普通HTML属性
 * @param {HTMLElement} el - 真实DOM元素
 * @param {string} key - 属性名称
 * @param {string|null|undefined} value - 属性最新值
 * @description diff更新时，对比新旧属性；
 * 有值就setAttribute设置属性；无值就removeAttribute删除属性
 */

export default function patchAttr(el, key, value) {
  if (value) {
    // 值存在：设置属性
    el.setAttribute(key, value);
  } else {
    // 值为 null / undefined / ''：删除属性
    el.removeAttribute(key);
  }
}
