
/**
 * class类名补丁
 * @description 直接赋值className；无值清空类名
 * @param {HTMLElement} el - 真实DOM
 * @param {string|null|undefined} value - 最新class字符串
 * 
 */
export default function patchClass(el, value) {
  if (value == null) {
    el.removeAttribute("class");
  } else {
    el.className = value;
  }
}
